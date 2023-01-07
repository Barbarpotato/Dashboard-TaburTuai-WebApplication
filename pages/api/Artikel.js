import { db } from '../../firebase/admin'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let dataArr = []
    const artikel = db.collection('Artikel')
    const snapshot = await artikel.get()
    snapshot.forEach(doc => {
      dataArr.push({
        Judul: doc._fieldsProto.Judul.stringValue,
        Deskripsi: doc._fieldsProto.Deskripsi.stringValue,
        Image: doc._fieldsProto.Image.stringValue
      })
    });
    return res.status(200).json(dataArr)
  } else {
    res.status(405).send({ message: 'Only GET requests allowed' })
  }
}
