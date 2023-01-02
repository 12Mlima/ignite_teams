import AsyncStorage from '@react-native-async-storage/async-storage'
import { PLAYER_COLLECTION } from '@storage/storageConfig'
import { AppError } from '@utils/AppError'
import { playersGetAll } from './playersGetAll'
import { PlayerStorageDTO } from './playerStorageDTO'

export async function playerAddByGroup(
  newPlayer: PlayerStorageDTO,
  group: string,
) {
  try {
    const storedPlayers = await playersGetAll(group)

    const playerAlreadyExists = storedPlayers.filter(
      (player) => player.name === newPlayer.name,
    )

    if (playerAlreadyExists.length > 0) {
      throw new AppError(`O jogador ${newPlayer.name} já está no grupo!`)
    }

    const storage = JSON.stringify([...storedPlayers, newPlayer])

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage)
  } catch (error) {
    throw error
  }
}
