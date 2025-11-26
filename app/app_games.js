import { SafeAreaView } from "react-native-safe-area-context";
import { View, Button, StyleSheet, Text, TextInput, Keyboard, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";

async function getGames() {
    const resposta = await fetch(`http://177.44.248.50:8080/games`);
    if (resposta.ok) {
        const payload = await resposta.json();
        return payload;
    }
    return [];
}

async function cadastra(title, slug, platform, price) {
    const resposta = await fetch(`http://177.44.248.50:8080/games`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, platform, price })
    });
}

async function deleta(id) {
    const resposta = await fetch(`http://177.44.248.50:8080/games/${id}`, {
        method: 'DELETE'
    });
}

async function getGameById(id) {
    const resposta = await fetch(`http://177.44.248.50:8080/games/${id}`,)
    if (resposta.ok) {
        const payload = await resposta.json();
        return payload;
    }
}

async function atualizar(id, title, slug, platform, price) {
    const resposta = await fetch(`http://177.44.248.50:8080/games/${id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, platform, price })
    });
}

async function buscar(title) {
    const resposta = await fetch(`http://177.44.248.50:8080/games/search?q=${title}`,)
    if (resposta.ok) {
        const payload = await resposta.json();
        return payload;
    }
}

export default function gamesApi() {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [platform, setPlatform] = useState('');
    const [price, setPrice] = useState('');
    const [games, setGames] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [nomeBuscar, setNomeBuscar] = useState(null)

    async function carregarGames() {
        const lista = await getGames();
        setGames(lista);
        
        Keyboard.dismiss();
    }

    async function salvar() {
        const titleTemp = title.trim();
        const slugTemp = slug.trim();
        const platformTemp = platform.trim();
        const priceTemp = price.trim();

        if (!title || !slug || !price) {
            alert("Por favor, preencha o título e/ou slug e/ou valor.");
            return;
        }

        await cadastra(titleTemp, slugTemp, platformTemp, priceTemp);

        setTitle("");
        setSlug("");
        setPlatform("");
        setPrice("");
        carregarGames();

        Keyboard.dismiss();
    }

    async function deletarGame(id) {
        await deleta(id);
        carregarGames();
    }

    async function editarGame(id) {
        const gameTemp = await getGameById(id);

        if (!gameTemp) return;

        setTitle(gameTemp.title);
        setSlug(gameTemp.slug);
        setPlatform(gameTemp.platform);
        setPrice(String(gameTemp.price));
        setEditandoId(id);
    }

    async function atualizarGame() {
        const titleTemp = title.trim();
        const slugTemp = slug.trim();
        const platformTemp = platform.trim();
        const priceTemp = price.trim();

        if (!title || !slug || !price || !editandoId) return;

        await atualizar(editandoId, titleTemp, slugTemp, platformTemp, Number(priceTemp));

        setTitle("");
        setSlug("");
        setPlatform("");
        setPrice("");
        setEditandoId(null)
        carregarGames();

        Keyboard.dismiss();
    }
    async function buscarGame() {
        const nomeBuscarTemp = nomeBuscar.trim();

        if (!nomeBuscar) {
            alert("Por favor, preencha o campo de pesquisa.");
            return;
        }

        const lista = await buscar(nomeBuscarTemp);
        setGames(lista);
        setNomeBuscar("");

        Keyboard.dismiss();
    }

    useEffect(() => {
        carregarGames();
    }, []);

    return (
        <SafeAreaView style={estilos.container}>

            <Text style={estilos.titulo}>Cadastro de Games</Text>

            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: CS2, Rocket League..."
                style={estilos.input}
            />

            <TextInput
                value={slug}
                onChangeText={setSlug}
                placeholder="Ex: counter-strike-2, rocket-league..."
                style={estilos.input}
            />

            <TextInput
                value={platform}
                onChangeText={setPlatform}
                placeholder="Ex: PC, Tablet, Smartphone..."
                style={estilos.input}
            />

            <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="Ex: 10, 300..."
                keyboardType="numeric"
                style={estilos.input}
            />

            <Button
                title="Salvar"
                onPress={salvar}
                disabled={!!editandoId}
            />

            <Button
                title="Atualizar"
                onPress={atualizarGame}
                disabled={!editandoId}
            />
            
            <Button
                title="Listar Games"
                onPress={carregarGames}
            />

            <Button
                title="Voltar para tela inicial"
                onPress={() => router.replace("/")}
            />

            <TextInput
                value={nomeBuscar}
                onChangeText={setNomeBuscar}
                placeholder="Pesquisar: Count, Fort, Rocket..."
                style={estilos.input}
            />

            <Button
                title="Buscar Game"
                onPress={buscarGame}
            />

            <FlatList
                data={games}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={estilos.item}>
                        <Text style={estilos.textoItem}>Nome: {item.title}</Text>
                        <Text>Slug: {item.slug}</Text>
                        <Text>Plataforma: {item.platform}</Text>
                        <Text>Preço: R$ {item.price}</Text>
                        <View style={estilos.botaoExcluir}>
                            <Button
                                title="Excluir"
                                color={"white"}
                                onPress={() => deletarGame(item.id)}
                            />
                        </View>
                        <View style={estilos.botaoEditar}>
                            <Button
                                title="Editar"
                                color={"white"}
                                onPress={() => editarGame(item.id)}
                            />
                        </View>
                    </View>
                )}
            />

        </SafeAreaView>
    )
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },

    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },

    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        marginBottom: 8,
    },

    botoes: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },

    item: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
        marginBottom: 8,
    },

    textoItem: {
        fontWeight: "bold",
    },

    botaoExcluir: {
        marginTop: 5,
        backgroundColor: '#EF4444',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },

    botaoEditar: {
        marginTop: 5,
        backgroundColor: '#447aefff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
});