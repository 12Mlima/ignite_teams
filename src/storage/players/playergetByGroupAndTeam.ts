import { playersGetAll } from './playersGetAll'

export async function playersGetByGroupAndTeam(group: string, team: string) {
  try {
    const storage = await playersGetAll(group)

    const players = storage.filter((player) => player.team === team)

    return players
  } catch (err) {
    throw err
  }
}
