import { db, serverTimeStamp } from '../../firebase/admin'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const date = new Date()
        const body = req.body
        await db.collection('Formulir').add({
            Nama: body.Nama,
            Email: body.Email,
            Telpon: body.Telpon,
            Pesan: body.Pesan,
            Waktu: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
        })
        await db.collection('Riwayat').add({
            Deskripsi: `Pesan Kontak Formulir Masuk dengan Nama ${body.Nama}`,
            Timestamp: serverTimeStamp,
            Waktu: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate(),
            Tipe: 'Create'
        })
        return res.status(200).json({ status: 'success' })
    } else {
        res.status(405).send({ message: 'Only POST requests allowed' })
    }
}
