import axios from "axios";
import { CREATOR } from "../../../settings.js";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { UrlQris, amount } = req.query;

    if (!UrlQris || !amount) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Parameter 'UrlQris' dan 'amount' wajib diisi",
        });
    }

    try {
        const apiUrl = `https://api.kenz.my.id/api/v2/create/createpayment?UrlQris=${encodeURIComponent(UrlQris)}&amount=${encodeURIComponent(amount)}`;
        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        if (!response.data || response.status !== 200) {
            return res.status(500).json({
                status: false,
                creator: CREATOR,
                error: "Gagal mengambil gambar QRIS dari API eksternal",
            });
        }

        const imageBuffer = Buffer.from(response.data);

        res.setHeader("Content-Type", "image/png");
        res.setHeader("Content-Length", imageBuffer.length);
        res.status(200).send(imageBuffer);

    } catch (error) {
        console.error("Error fetching image:", error.message);

        let errorMessage = "Internal Server Error";
        if (error.response) {
            errorMessage = `Error from server: ${error.response.status} ${error.response.statusText}`;
        } else if (error.request) {
            errorMessage = "No response received from server";
        }

        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: errorMessage,
        });
    }
}
