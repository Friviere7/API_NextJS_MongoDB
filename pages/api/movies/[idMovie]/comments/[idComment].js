// (GET/POST/PUT/DELETE) /api/movies/[idMovie]/comments/[idComment]
import { ObjectId } from "mongodb";
import clientPromise from "../../../../../lib/mongodb";

export default async function handler(req, res) {
    const { idMovie, idComment } = req.query;
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    switch (req.method) {
        case "GET":
            try {
                // Section pour récupérer le commentaire spécifié par son ID et l'ID du film
                const comment = await db.collection("comments").findOne({ _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie) });
                // Section pour vérifier l'existence du commentaire
                if (!comment) {
                    res.status(404).json({ status: 404, msg: "Commentaire non trouvé" });
                    return;
                }
                // Section pour retourner le commentaire
                res.json({ status: 200, data: { comment } });
            } catch (error) {
                // Section pour la gestion des erreurs
                res.status(500).json({ status: 500, error: error.message });
            }
            break;

        case "POST":
            try {
                // Section pour récupérer les paramètres du corps de la requête
                const bodyParams = req.body;
                // Section pour ajouter l'ID du film au commentaire
                bodyParams.movie_id = new ObjectId(idMovie);
                // Section pour insérer le commentaire dans la base de données
                const dbReturn = await db.collection("comments").insertOne(bodyParams);
                // Section pour récupérer le commentaire inséré
                const dbComment = await db.collection("comments").findOne({ _id: new ObjectId(dbReturn.insertedId) });
                // Section pour retourner le commentaire ajouté
                res.json({ status: 200, data: dbComment, msg: "Commentaire ajouté avec succès" });
            } catch (error) {
                // Section pour la gestion des erreurs
                res.status(500).json({ status: 500, error: error.message });
            }
            break;
            
        case "PUT":
            try {
                // Section pour récupérer les paramètres du corps de la requête
                const bodyParams = req.body;
                // Section pour mettre à jour le commentaire dans la base de données
                await db.collection("comments").updateOne(
                    { _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie) },
                    { $set: bodyParams }
                );
                // Section pour retourner un message de succès
                res.json({ status: 200, msg: "Commentaire mis à jour avec succès" });
            } catch (error) {
                // Section pour la gestion des erreurs
                res.status(500).json({ status: 500, error: error.message });
            }
            break;

        case "DELETE":
            try {
                // Section pour supprimer le commentaire de la base de données
                await db.collection("comments").deleteOne({ _id: new ObjectId(idComment), movie_id: new ObjectId(idMovie) });
                // Section pour retourner un message de succès
                res.json({ status: 200, msg: "Commentaire supprimé avec succès" });
            } catch (error) {
                // Section pour la gestion des erreurs
                res.status(500).json({ status: 500, error: error.message });
            }
            break;

        default:
            // Section pour la gestion des méthodes non autorisées
            res.status(405).json({ status: 405, msg: "Méthode non autorisée" });
            break;
    }
}
