export default () => {
  const date = useLocalStorage('game-date');
  const host = useLocalStorage('game-host');
  const scores = useLocalStorage('game-scores', {});

  const createGame = (d, h) => {
    date.value = d;
    host.value = h;
    scores.value = {};
  }

  const clearScores = () => {
    for ( const team in scores.value ) {
      for ( let round = 1; round <= 5; round ++ ) {
        setScore(team, round);
      }
    }
  }

  const clearGame = () => {
    date.value = '';
    host.value = '';
    scores.value = {};
  }

  const addTeam = (e, n) => {
    scores.value[n] = {
      entry: e,
      name: n,
      round1: false,
      round2: false,
      round3: false,
      round4: false,
      round5: false,
      bowlOff: false,
      total: false,
      rank: false
    }
  }

  const removeTeam = (n) => {
    delete scores.value[n];
  }

  const nextEntry = () => {
    let max = 0;
    for ( const team in scores.value ) {
      const e = scores.value[team].entry;
      max = e > max ? e : max;
    }
    return max+1;
  }

  const teams = (sort, descending) => {
    if ( !sort ) {
      return Object.keys(scores.value);
    }
    else {
      let s = Object.values(scores.value);
      s = s.sort((a, b) => {
        return a[sort] < b[sort] ? (descending ? 1 : -1) 
          : a[sort] > b[sort] ? (descending ? -1 : 1) 
          : 0;
      });

      const teams = [];
      s.forEach((e) => {
        teams.push(e.name);
      });
      return teams;
    }
  }

  const getScore = (team, round) => {
    return scores.value[team][`round${round}`];
  }

  const setScore = (team, round, score) => {
    scores.value[team][`round${round}`] = score;
    _calc();
  }

  const _calc = () => {

    // Calculate the team totals
    const totals = [];
    for ( const team in scores.value ) {
      let team_total = 0;
      for ( let round = 1; round <= 5; round++ ) {
        const round_score = scores.value[team][`round${round}`];
        if ( round_score ) team_total = team_total + round_score;
      }
      scores.value[team].total = team_total > 0 ? team_total : false;
      totals.push(team_total);
    }

    // Set the ranks
    const unique = [...new Set(totals)];
    const sorted = unique.sort((a, b) => b - a);
    for ( const team in scores.value ) {
      const team_rank = sorted.indexOf(scores.value[team].total) + 1;
      scores.value[team].rank = team_rank;
    }

  }

  return {
    date, host, scores, teams,
    createGame, clearScores, clearGame,
    addTeam, removeTeam, nextEntry,
    getScore, setScore
  }
}