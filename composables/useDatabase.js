import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, get, set, remove, onValue, off } from "firebase/database";
import { useMD5 } from "./useMD5";

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

// Game Owner and Current User watcher:
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
      const gameKey = useMD5([d, h, t]);
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
      const team_key = useMD5(n);
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
      const team_key = useMD5(n);
      remove(dbRef(database, `games/${currentGame.value}/scores/${team_key}`));
    }
  }

  // Update the name of an existing team
  // o = old team name
  // n = new team name
  const updateTeamName = (o, n) => {
    if ( currentGame.value && o !== n ) {
      const old_team_key = useMD5(o);
      const new_team_key = useMD5(n);
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
    const key = useMD5(team);
    return scores.value[key];
  }

  // Get the score for the specified team and round
  const getScore = (team, round) => {
    const key = useMD5(team);
    return scores.value[key] ? scores.value[key][`round${round}`] : undefined;
  }

  // Set the score for the specified team and round
  const setScore = (team, round, score=false) => {
    const key = useMD5(team);
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
