export function createAgentState(query) {
  return {
    query,
    iteration: 0,
    maxIterations: Number(process.env.MAX_AGENT_ITERATIONS || 6),
    status: "running",
    finalAnswer: "",
    actions: [],
    observations: [],
    startedAt: new Date().toISOString(),
    completedAt: null
  };
}

export function recordAction(state, action) {
  state.actions.push({ timestamp: new Date().toISOString(), ...action });
}

export function recordObservation(state, observation) {
  state.observations.push({ timestamp: new Date().toISOString(), ...observation });
}
