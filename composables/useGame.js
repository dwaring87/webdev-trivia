export default () => {
  const date = useLocalStorage('game-date');
  const host = useLocalStorage('game-host');
  const teams = useLocalStorage('game-teams', []);
  const scores = useLocalStorage('game-scores', {});

  const clearGame = () => {
    date.value = '';
    host.value = '';
    teams.value = [];
    scores.value = {};
  }

  const createGame = (d, h) => {
    date.value = d;
    host.value = h;
    teams.value = [];
    scores.value = {};
  }

  const addTeam = (e, n) => {
    teams.value.push(n);
    scores.value[n] = {
      entry: e,
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
    teams.value = teams.value.filter(e => e !== n);
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

  watch(scores, (updated) => {
    
    // Calculate the team totals
    const totals = [];
    for ( const team in updated ) {
      let team_total = 0;
      for ( const round in [1,2,3,4,5] ) {
        const round_score = updated[team][`round${round}`];
        if ( round_score ) team_total = team_total + round_score;
      }
      scores.value[team].total = team_total > 0 ? team_total : false;
      totals.push(team_total);
    }

    // Set the ranks
    const unique = [...new Set(totals)];
    const sorted = unique.sort((a, b) => b - a);
    for ( const team in updated ) {
      const team_rank = sorted.indexOf(updated[team].total) + 1;
      scores.value[team].rank = team_rank;
    }

  });

  return {
    date, host, teams, scores, 
    clearGame, createGame, addTeam, removeTeam,
    nextEntry
  }
}