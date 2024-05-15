import { upload } from "./imgUpload.js";

const handleImageUpload = upload.array('images', 5);

export const uploadImages = (req, res, next) => {
    handleImageUpload(req, res, (error) => {
        if (error) {
            return res.status(400).send({
                message: "Errpr uploading images",
                success: false,
                error,
            });
        }
        next();
    });
}