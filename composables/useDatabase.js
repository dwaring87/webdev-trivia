import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, get, set, remove, onValue, off } from "firebase/database";

const initializing = ref(true);
const { public:config } = useRuntimeConfig();
if ( config.firebase?.databaseURL === 'NOT_SET' ) throw new Error('Firebase Database URL not set!');
const app = initializeApp(config.firebase);
const database = getDatabase(app);
const { id:currentUser } = useAuth();

// Game key for the currently loaded game (kept in local storage)
const currentGame = useLocalStorage('current-game');
const hasGame = computed(() => {
  return !!currentGame.value && currentGame.value !== '' && gameKeys.value.includes(currentGame.value)
});

// Game properties (vue refs used in the app)
const date = ref();
const rounds = ref();
const host = ref();
const owner = ref();
const scores = ref([]);
const editable = ref(false);

// Get existing games
// gameKeys = list of existing game keys (owner/game)
// getGames = returns a (flattened) list of all games
const gameKeys = ref([]);
const getGames = async () => {
  const games = [];
  const snapshot = await get(dbRef(database, `games/`));
  const data = snapshot.exists() ? snapshot.val() : {};
  const users = Object.keys(data);
  users.forEach((user) => {
    Object.values(data[user]).forEach((game) => {
      game.teams = Object.values(game.scores || {}).length;
      game.winner = Object.values(game.scores || {}).filter((e) => e.rank === 1).map((e) => e.name).join(', ');
      games.push(game);
      gameKeys.value.push(`${game.owner}/${game.key}`);
    })
  });
  initializing.value = false;
  return games;
};
getGames();

// Sorting properties (updated with the setTeamSort function)
const _sort_key = ref('entry');
const _sort_descending = ref(false);

// Current Game watcher:
// set value listeners that update the vue refs for the current game properties
watch(currentGame, (n, o) => {
  if ( o ) {
    off(dbRef(database, `games/${o}/date`));
    off(dbRef(database, `games/${o}/rounds`));
    off(dbRef(database, `games/${o}/host`));
    off(dbRef(database, `games/${o}/owner`));
    off(dbRef(database, `games/${o}/scores`));
  }
  if ( n ) {
    onValue(dbRef(database, `games/${n}/date`), (s) => date.value = s.val());
    onValue(dbRef(database, `games/${n}/rounds`), (s) => rounds.value = s.val());
    onValue(dbRef(database, `games/${n}/host`), (s) => host.value = s.val());
    onValue(dbRef(database, `games/${n}/owner`), (s) => owner.value = s.val());
    onValue(dbRef(database, `games/${n}/scores`), (s) => scores.value = s.val());
  }
}, { immediate: true });

// Game Owner and Current User water:
// update the editable state when the owner or current user changes
watch([owner, currentUser], ([new_owner, new_user]) => {
  editable.value = !!new_owner && !!new_user && new_owner === new_user;
}, { immediate: true });

export default () => {
 
  // Create a new game with the specified date, number of rounds, and host
  // User must be logged in to create a game (set as owner)
  const createGame = async (d, r, h) => {
    const t = new Date().getTime();
    if ( currentUser.value ) {
      const gameKey = md5([d, h, t]);
      currentGame.value = `${currentUser.value}/${gameKey}`;
      const init = {
        owner: currentUser.value,
        key: gameKey,
        date: d,
        rounds: r,
        host: h,
        created: t,
        scores: {}
      }
      set(dbRef(database, `games/${currentGame.value}`), init);
      await getGames();
      return currentGame.value;
    }
  }

  // Remove the current game from the database
  const clearGame = async () => {
    if ( currentGame.value ) {
      remove(dbRef(database, `games/${currentGame.value}`));
      await getGames();
      currentGame.value = '';
    }
  }

  // Remove all of the teams' scores from the current game
  const clearScores = () => {
    teams.value.forEach((team) => {
      for ( let round = 1; round <= rounds.value; round ++ ) {
        setScore(team, round);
      }
    });
  }

  // Add a new team to the current game
  // e = entry number
  // n = team name
  const addTeam = (e, n) => {
    if ( currentGame.value ) {
      const team_key = md5(n);
      const init = {
        entry: e,
        name: n,
        total: false,
        rank: false,
        tieBreaker: false
      }
      for ( let i = 1; i <= rounds.value; i++ ) {
        init[`round${i}`] = false;
      }
      set(dbRef(database, `games/${currentGame.value}/scores/${team_key}`), init);
    }
  }

  // Remove a team from the current game
  // n = team name
  const removeTeam = (n) => {
    if ( currentGame.value ) {
      const team_key = md5(n);
      remove(dbRef(database, `games/${currentGame.value}/scores/${team_key}`));
    }
  }

  // Update the name of an existing team
  // o = old team name
  // n = new team name
  const updateTeamName = (o, n) => {
    if ( currentGame.value && o !== n ) {
      const old_team_key = md5(o);
      const new_team_key = md5(n);
      const copy = { ...scores.value[old_team_key] };
      copy.name = n;
      set(dbRef(database, `games/${currentGame.value}/scores/${new_team_key}`), copy);
      remove(dbRef(database, `games/${currentGame.value}/scores/${old_team_key}`));
    }
  }

  // Get the next entry number for the next team to be added to the current game
  const nextEntry = computed(() => {
    let max = 0;
    for ( const key in scores.value ) {
      const e = scores.value[key].entry;
      max = e > max ? e : max;
    }
    return max+1;
  });

  // Set the team sort properties
  // key = name of property to sort teams by (entry, name, rank, total, round1, etc)
  // descending = set to true to sort by descending values
  const setTeamSort = (key='entry', descending=false) => {
    _sort_key.value = key;
    _sort_descending.value = descending;
  };

  // Get an array of team names from the current game, sorted by the set sort properties
  const teams = computed(() => {
    let s = scores.value ? Object.values(scores.value) : [];
    s = s.sort((a, b) => {
      return a[_sort_key.value] < b[_sort_key.value] ? (_sort_descending.value ? 1 : -1) 
        : a[_sort_key.value] > b[_sort_key.value] ? (_sort_descending.value ? -1 : 1) 
        : 0;
    });

    const rtn = [];
    s.forEach((e) => {
      rtn.push(e.name);
    });
    return rtn;
  });

  // Get all of the scores for the specified team
  const teamScores = (team) => {
    const key = md5(team);
    return scores.value[key];
  }

  // Get the score for the specified team and round
  const getScore = (team, round) => {
    const key = md5(team);
    return scores.value[key] ? scores.value[key][`round${round}`] : undefined;
  }

  // Set the score for the specified team and round
  const setScore = (team, round, score=false) => {
    const key = md5(team);
    scores.value[key][`round${round}`] = score;
    set(dbRef(database, `games/${currentGame.value}/scores/${key}/round${round}`), score);
    _calc();
  }

  // Update all of the totals and ranks for all of the teams in the current game
  const _calc = () => {

    // Calculate the team totals
    const totals = [];
    for ( const key in scores.value ) {
      let team_total = 0;
      for ( let round = 1; round <= rounds.value; round++ ) {
        const round_score = scores.value[key][`round${round}`];
        if ( round_score ) team_total = team_total + round_score;
      }
      scores.value[key].total = team_total > 0 ? team_total : false;
      totals.push(team_total);
      set(dbRef(database, `games/${currentGame.value}/scores/${key}/total`), scores.value[key].total);
    }

    // Set the ranks
    const unique = [...new Set(totals)];
    const sorted = unique.sort((a, b) => b - a);
    for ( const key in scores.value ) {
      const team_rank = sorted.indexOf(scores.value[key].total) + 1;
      scores.value[key].rank = team_rank;
      set(dbRef(database, `games/${currentGame.value}/scores/${key}/rank`), scores.value[key].rank);
    }

  }
  
  return {
    initializing, hasGame, currentGame, date, rounds, host, owner, editable, scores, teams, nextEntry,
    createGame, addTeam, removeTeam, updateTeamName,
    clearGame, clearScores, setTeamSort, teamScores, getScore, setScore, getGames
  };
}


const md5 = (input) => {
  const inputString = Array.isArray(input) ? input.join('|') : input;
  var hc="0123456789abcdef";
  function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
  function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
  function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
  function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
  function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
  function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
  function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
  function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
  function sb(x) {
      var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
      for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
      blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
  }
  var i,x=sb(""+inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
  for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
      a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
      b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
      c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
      d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
      a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
      b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
      c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
      d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
      a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
      b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
      c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
      d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
      a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
      b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
      c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
      d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
      a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
      b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
      c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
      d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
      a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
      b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
  }
  return rh(a)+rh(b)+rh(c)+rh(d);
}