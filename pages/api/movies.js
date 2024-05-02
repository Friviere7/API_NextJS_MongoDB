//(GET) /api/movies
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise; // Attente de la promesse de connexion au client MongoDB
        const db = client.db("sample_mflix"); // Sélection de la base de données "sample_mflix"
        
        // Récupération de 10 films depuis la collection "movies"
        const movies = await db.collection("movies").find({}).limit(10).toArray();
        
        // Retour des films avec un statut HTTP 200 en cas de succès
        res.json({ status: 200, data: movies });
    } catch (error) {
        // Gestion des erreurs en retournant un statut HTTP 500 avec un message d'erreur
        res.status(500).json({ status: 500, error: error.message });
    }
}
