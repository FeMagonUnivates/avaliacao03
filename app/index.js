import { Button, View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Index() {
    return (
        <SafeAreaView>
            <ScrollView>
                <Button title="Ir para Games" onPress={() => router.replace("/app_games")}/>
            </ScrollView>
        </SafeAreaView>
    )
}