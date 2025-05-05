class Teams {
  private static instance: Teams;
  private constructor() {}
  static getInstance() {
    if (Teams.instance) {
      Teams.instance = new Teams();
    }
    return Teams.instance;
  }
}

export default Teams;
