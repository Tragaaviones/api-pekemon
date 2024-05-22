import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TextInput, ActivityIndicator } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const numColumns = 3;

import PokemonItem from '../components/PokemonItem';
import FormularioPokemon from '../components/FormularioPokemon';

export default function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cantidadPokemon, setCantidadPokemon] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${cantidadPokemon}`);
      const data = await response.json();

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon, index) => {
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonResponse.json();
          const ability = pokemonData.abilities[0]?.ability.name || 'No ability';
          return { ...pokemon, id: index + 1, ability };
        })
      );

      setPokemon(pokemonDetails);
    } catch (error) {
      console.log("Hubo un error listando los pokemones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cantidadPokemon]);

  const filteredPokemon = pokemon.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <FormularioPokemon
        tituloFormulario='Listado de Pokemones usando Fetch'
        labelInput='Ingrese la cantidad de pokemon a cargar: '
        placeHolderInput='20'
        valor={cantidadPokemon}
        setValor={setCantidadPokemon}
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
          renderItem={({ item }) => <PokemonItem item={item} />}
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
    textAlign: 'center'
  },
  list: {
    justifyContent: 'center',
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
