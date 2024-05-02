//(GET) /api/movies/[idMovie]/comments
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
    const { idMovie } = req.query; // Récupération de l'ID du film depuis la requête
    const client = await clientPromise; // Attente de la promesse de connexion au client MongoDB
    const db = client.db("sample_mflix"); // Sélection de la base de données "sample_mflix"

    try {
        // Récupération de tous les commentaires associés à l'ID du film spécifié
        const comments = await db.collection("comments").find({ movie_id: new ObjectId(idMovie) }).toArray();
        // Retour des commentaires avec un statut HTTP 200
        res.status(200).json({ status: 200, data: comments });
    } catch (error) {
        // Gestion des erreurs en retournant un statut HTTP 500 avec un message d'erreur
        res.status(500).json({ status: 500, error: error.message });
    }
}
