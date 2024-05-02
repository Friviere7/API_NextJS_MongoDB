//(GET/POST/PUT/DELETE) /api/movies/[idMovie]
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
    const { idMovie } = req.query;
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    switch (req.method) {
        case "DELETE":
            try {
                // Section pour supprimer le film avec l'ID spécifié
                await db.collection("movies").deleteOne({ _id: new ObjectId(idMovie) });
                res.json({ status: 200, msg: "Film supprimé avec succès" });
            } catch (error) {
                // Gestion des erreurs en retournant un statut HTTP 500 avec un message d'erreur
                res.status(500).json({ status: 500, error: error.message });
            }
            break;

        case "POST":
            try {
                const bodyParams = req.body;
                // Section pour insérer un nouveau film avec les paramètres du corps de la requête
                const dbReturn = await db.collection("movies").insertOne(bodyParams);
                // Section pour récupérer le film inséré depuis la base de données
                const dbMovie = await db.collection("movies").findOne({ _id: new ObjectId(dbReturn.insertedId) });
                res.json({ status: 200, data: dbMovie, msg: "Film ajouté avec succès" });
            } catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
            break;

        case "PUT":
            try {
                const { runtime, year } = req.body;
                // Section pour mettre à jour les informations du film avec l'ID spécifié
                await db.collection("movies").updateOne(
                    { _id: new ObjectId(idMovie) },
                    { $set: { runtime, year } }
                );
                res.json({ status: 200, msg: "Film mis à jour avec succès" });
            } catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
            break;

        case "GET":
            try {
                // Section pour récupérer le film avec l'ID spécifié
                const dbMovie = await db.collection("movies").findOne({ _id: new ObjectId(idMovie) });
                if (!dbMovie) {
                    // Section pour retourner un statut HTTP 404 si le film n'est pas trouvé
                    res.status(404).json({ status: 404, msg: "Film non trouvé" });
                    return;
                }
                res.json({ status: 200, data: { film: dbMovie } });
            } catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
            break;

        default:
            // Section pour retourner un statut HTTP 405 si la méthode de requête n'est pas autorisée
            res.status(405).json({ status: 405, msg: "Méthode non autorisée" });
            break;
    }
}
