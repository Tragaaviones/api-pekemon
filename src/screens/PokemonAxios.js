import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import FormularioPokemon from '../components/FormularioPokemon';

const WIDTH = Dimensions.get('window').width;
const numColumns = 3;

export default function PokemonAxios() {
  const [pokemon, setPokemon] = useState([]);
  const [nPokemon, setNPokemon] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getPokemon(nPokemon);
  }, [nPokemon]);

  const getPokemon = async (nPokemon) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${nPokemon}`);
      const dataPokemon = response.data;

      const pokemonDetails = await Promise.all(
        dataPokemon.results.map(async (pokemon) => {
          const pokemonResponse = await axios.get(pokemon.url);
          const ability = pokemonResponse.data.abilities[0]?.ability.name || 'No ability';
          return { ...pokemon, ability };
        })
      );

      setPokemon(pokemonDetails);
      setLoading(false);
    } catch (error) {
      console.log("Hubo un error listando los pokemones", error);
      setLoading(false);
    }
  };

  const filteredPokemon = pokemon.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text>Número Pokedex: <Text style={styles.number}>{item.url.split('/')[6]}</Text></Text>
        <Image
          style={styles.image}
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.url.split('/')[6]}.png` }}
        />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.ability}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FormularioPokemon
        tituloFormulario='Listado de Pokemones usando Axios'
        labelInput='Ingrese la cantidad de pokemon a cargar: '
        placeHolderInput='20'
        valor={nPokemon}
        setValor={setNPokemon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar Pokémon por nombre"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredPokemon}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    margin: 5,
    width: WIDTH / numColumns - 10,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  image: {
    width: 80,
    height: 80,
  },
  number: {
    fontWeight: 'bold'
  },
  loading: {
    marginTop: 20,
  },
  searchInput: {
    width: '70%',
    backgroundColor: '#dfd7d7',
    height: 50,
    fontWeight: '900',
    borderRadius: 5,
    margin: 5,
    fontSize: 18,
    paddingHorizontal: 10,
  },
});
