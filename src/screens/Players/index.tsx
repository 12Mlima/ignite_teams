import { Button } from '@components/Button'
import { ButtonIcon } from '@components/ButtonIcon'
import { Filter } from '@components/Filter'
import { Header } from '@components/Header'
import { Hightlight } from '@components/Hightlight'
import { Input } from '@components/Input'
import { ListEmpty } from '@components/ListEmpty'
import { Loading } from '@components/Loading'
import { PlayerCard } from '@components/PlayerCard'
import { useNavigation, useRoute } from '@react-navigation/native'
import { groupRemoveByName } from '@storage/group/groupRemoveByName'
import { playerAddByGroup } from '@storage/players/playerAddByGroup'
import { playersGetByGroupAndTeam } from '@storage/players/playergetByGroupAndTeam'
import { playerRemoveByGroup } from '@storage/players/playerRemoveByGroup'
import { PlayerStorageDTO } from '@storage/players/playerStorageDTO'
import { AppError } from '@utils/AppError'
import { useEffect, useState, useRef } from 'react'
import { Alert, FlatList, TextInput } from 'react-native'
import { Container, Form, HeaderList, NumberOfPlayers } from './styles'

type RouteParams = {
  group: string
}

export function PLayers() {
  const [isLoading, setIsLoading] = useState(true)

  const [playerName, setPlayerName] = useState('')

  const [team, setTeam] = useState('Time A')
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

  const navigation = useNavigation()
  const route = useRoute()

  const { group } = route.params as RouteParams

  const newPlayerNameInputRef = useRef<TextInput>(null)

  async function handleAddPlayer() {
    if (playerName.trim().length === 0) {
      return Alert.alert(
        'Novo jogador',
        'Informe o nome do jogador para adicioná-lo',
      )
    }

    const newPlayer = {
      name: playerName,
      team: team,
    }

    try {
      await playerAddByGroup(newPlayer, group)

      fetchPlayersByTeam()

      newPlayerNameInputRef.current?.blur()

      setPlayerName('')
    } catch (err) {
      if (err instanceof AppError) {
        Alert.alert('Novo jogador', err.message)
      } else {
        Alert.alert('Novo jogador', 'Não foi possível adicionar.')
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true)

      const playersByTeam = await playersGetByGroupAndTeam(group, team)
      setPlayers(playersByTeam)

      setIsLoading(false)
    } catch (err) {
      Alert.alert('Jogador', 'Não foi possível carregar o jogadores.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group)

      fetchPlayersByTeam()
    } catch (error) {
      Alert.alert('Remover jogador', 'Não foi possível remover o jogador.')
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group)
      navigation.navigate('groups')
    } catch (error) {
      console.log(error)
      Alert.alert('Remover Turma', 'Não foi posível remover a turma')
    }
  }

  async function handleGroupRemove() {
    Alert.alert('Remover', 'Deseja remover a turma?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => groupRemove() },
    ])
  }

  useEffect(() => {
    fetchPlayersByTeam()
  }, [team])

  return (
    <Container>
      <Header showBackButton />
      <Hightlight
        title={group}
        subtitle="Adicione a galera e separe os times"
      />
      <Form>
        <Input
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setPlayerName}
          value={playerName}
          inputRef={newPlayerNameInputRef}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon icon={'add'} onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={['Time A', 'Time B']}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Filter
                title={item}
                isActive={item === team}
                onPress={() => setTeam(item)}
              />
            )}
            horizontal
          />
        )}

        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      <FlatList
        data={players}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PlayerCard
            name={item.name}
            onRemove={() => {
              handlePlayerRemove(item.name)
            }}
          />
        )}
        ListEmptyComponent={<ListEmpty message="Não há pessoas nesse time!" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 100 },
          players.length === 0 && { flex: 1 },
        ]}
      />

      <Button
        title="Remover turma"
        type="secondary"
        onPress={handleGroupRemove}
      />
    </Container>
  )
}
