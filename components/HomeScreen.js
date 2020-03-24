import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Button
} from 'react-native';

let HomeScreen = (props) => {
    const [getRecipes, setRecipes] = useState([{ key: "1200", name: "Pizza", calories: 10 }, { key: "1201", name: "Biryani", calories: 20 }, { key: "1202", name: "Marshmellow", calories: 30 }])
    return (
        <View style={styles.container}>
            <FlatList
                data={getRecipes}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <View style={styles.itemButton}>
                            <Button title="Details"></Button>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

const styles = {
    container: {
        margin: 0,
        padding: 10,
        backgroundColor: "#8ee48f",
        height: "100%"
    },
    item: {
        borderWidth: 2,
        alignItems: "flex-start",
        justifyContent: "space-between",
        borderRadius: 5,
        marginBottom: 5,
        flexDirection: "row",
        backgroundColor: "#05386b",
        padding: 5
    },
    itemText: {
        fontSize: 20,
        marginLeft: 5,
        color: "#edf5e1",
        paddingTop: 3
    }
}
export default HomeScreen;