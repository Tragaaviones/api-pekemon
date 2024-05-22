import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const GitHubRepo = () => {
    const [repoData, setRepoData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRepo = async () => {
            try {
                const response = await axios.get(`https://api.github.com/repos/facebook/react`);
                setRepoData(response.data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchRepo();
    }, []);

    return (
        <View style={styles.container}>
            {error ? (
                <Text style={styles.error}>Error al cargar la información: {error}</Text>
            ) : (
                repoData && (
                    <View style={styles.card}>
                        <Text style={styles.title}>{repoData.full_name}</Text>
                        <Text style={styles.text}>{repoData.description}</Text>
                        <Text style={styles.text}>⭐ {repoData.stargazers_count}</Text>
                        <Text style={styles.text}>Forks: {repoData.forks_count}</Text>
                        <Text style={styles.date}>Última actualización: {new Date(repoData.updated_at).toLocaleDateString()}</Text>
                    </View>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    text: {
        marginTop: 10,
        fontSize: 16,
    },
    date: {
        marginTop: 10,
        fontSize: 14,
        color: '#888',
    },
    error: {
        color: 'red',
    },
});

export default GitHubRepo;
