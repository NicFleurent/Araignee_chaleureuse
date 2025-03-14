import * as SQLite from "expo-sqlite";
import { useEffect, useRef, useState } from "react";

const useBD = () => {
    const bd = useRef(null);
    const [prefs, setPrefs] = useState([]);

    useEffect(() => {
        const getBD = async () => {
            bd.current = await SQLite.openDatabaseAsync("bd_donnees.db");
            creerTables();
            getPrefsLocal();
        };
        getBD();
    }, []);

    const creerTables = async () => {
        try {
            await bd.current.execAsync(
                `CREATE TABLE IF NOT EXISTS comfort_preferences(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    active BOOLEAN,
                    humidity INTEGER,
                    name TEXT,
                    temperature INTEGER
                );`
            );
        } catch (e) {
            console.log("Erreur lors de la création de la table", e);
        }
    };

    const getPrefsLocal = async () => {
        if (!bd.current) {
            console.log("Base de données pas encore initialisée");
            return;
        }
        try {
            const resultat = await bd.current.getAllAsync(`SELECT * FROM comfort_preferences`);
            setPrefs(resultat);
        } catch (e) {
            console.log("Erreur lors de la récupération des données", e);
        }
    };
    

    const ajouterPrefsLocal = async (active, humidity, name, temperature) => {
        try {
            await bd.current.runAsync(
                `INSERT INTO comfort_preferences (active, humidity, name, temperature) VALUES (?, ?, ?, ?)`,
                [active, humidity, name, temperature]
            );
            console.log("ajout");
            getPrefsLocal();
        } catch (e) {
            console.log("Erreur lors de l'ajout des données", e);
        }
    };

    const supprimerPrefsLocal = async (id) => {
        if (!bd.current) {
            console.log("Base de données pas encore initialisée pour la suppresion complete");
            return;
        }
        try {
            await bd.current.runAsync(
                `DELETE FROM comfort_preferences WHERE id = ?`,
                [id]
            );
            getPrefsLocal();
        } catch (e) {
            console.log("Erreur lors de la suppression des données", e);
        }
    };

    const supprimerToutPrefsLocal = async () => {
        try {
            await bd.current.runAsync(
                `DELETE FROM comfort_preferences`
            );
            getPrefsLocal();
        } catch (e) {
            console.log("Erreur lors de la suppression des données", e);
        }
    };

    return {
        prefs,
        getPrefsLocal,
        ajouterPrefsLocal,
        supprimerPrefsLocal,
        supprimerToutPrefsLocal
    };
};

export default useBD;