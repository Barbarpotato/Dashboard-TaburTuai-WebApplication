import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { db, storage } from '../../firebase/config'
import { collection, getDoc, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Card, Text, Button, Row, Input, Textarea, Spacer } from "@nextui-org/react"
import { ref, deleteObject, getDownloadURL, uploadBytesResumable } from "firebase/storage"

function ArtikelDetail() {

    const router = useRouter()
    const ArtikelId = router.query.ArtikelId
    const [data, setData] = useState(null)
    const [disable, setDisable] = useState(false);
    const [isLoading, setLoading] = useState(false)

    const handleEdit = (event) => {
        //? Update data firestore.
        event.preventDefault()
        setDisable(true)
        const imgFile = event.target[2]?.files[0]
        if (imgFile === undefined) {
            (async () => {
                try {
                    event.preventDefault()
                    const text = String(event.target[1].value)
                    const formattedHTML = text.replace(/\r|\n/g, '<br>')
                    const date = new Date()
                    const detailArtikelRef = doc(db, "Artikel", ArtikelId);
                    await updateDoc(detailArtikelRef, {
                        Judul: event.target[0].value,
                        Deskripsi: formattedHTML,
                        Waktu: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate()
                    })
                    const riwayatRef = collection(db, 'Riwayat')
                    await addDoc(riwayatRef, {
                        Deskripsi: `Perubahan Artikel dengan Judul ${event.target[0].value}`,
                        Timestamp: serverTimestamp(),
                        Waktu: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate(),
                        Tipe: 'Update'
                    })
                    alert('Berhasil Ubah Data')
                    router.push('/Artikel')
                } catch (err) {
                    alert('Gagal Memperbaharui Data')
                    router.push('/Artikel')
                }
            })()
        } else {
            (async () => {
                //? Delete Previous Image
                const deleteImg = ref(storage, data.ImageLocation);
                const snapshot = await deleteObject(deleteImg);
                //? Uploading new Image
                const storageRef = ref(storage, `Artikel/${imgFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imgFile);
                uploadTask.on("state_changed",
                    () => { },
                    (error) => {
                        alert(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            (async () => {
                                try {
                                    event.preventDefault()
                                    const text = String(event.target[1].value)
                                    const formattedHTML = text.replace(/\r|\n/g, '<br>')
                                    const date = new Date()
                                    const detailArtikelRef = doc(db, "Artikel", ArtikelId);
                                    await updateDoc(detailArtikelRef, {
                                        Judul: event.target[0].value,
                                        Deskripsi: formattedHTML,
                                        Image: downloadURL,
                                        ImageLocation: `Artikel/${imgFile.name}`,
                                        Waktu: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate()
                                    })
                                    const riwayatRef = collection(db, 'Riwayat')
                                    await addDoc(riwayatRef, {
                                        Deskripsi: `Perubahan Artikel dengan Judul ${event.target[0].value}`,
                                        Timestamp: serverTimestamp(),
                                        Waktu: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate(),
                                        Tipe: 'Update'
                                    })
                                    alert('Berhasil Ubah Data')
                                    router.push('/Artikel')
                                } catch (err) {
                                    alert('Gagal Memperbaharui Data')
                                    router.push('/Artikel')
                                }
                            })()
                        });
                    }
                );
            })()
        }
    }

    useEffect(() => {
        if (!sessionStorage.getItem('isAuth')) push('/');
        //? Read Detail Artikel in Firestore.
        (async () => {
            setLoading(true)
            try {
                const docRef = doc(db, 'Artikel', ArtikelId)
                const snapshot = await getDoc(docRef)
                setData(snapshot.data())
            }
            catch (err) {
                router.push('/Artikel')
            }
        })()
        setLoading(false)
    }, [])

    if (isLoading) { return (<div><p>Loading...</p></div>) }
    if (!data) { return (<div><p>There is no data</p></div>) }

    return (
        <div className="flex flex-row justify-center mt-[5%]">
            <Card css={{ width: "100vh" }}>
                <Card.Header>
                    <Text b>Ubah Data Artikel</Text>
                </Card.Header>
                <Card.Divider />
                <form onSubmit={handleEdit}>
                    <Card.Body css={{ py: "$10" }}>
                        <Input required label="Judul Artikel" initialValue={data.Judul}></Input>
                        <Spacer />
                        <Textarea rows={20} required css={{ width: '100%' }} name="deskripsi" label="Deksripsi Artikel" initialValue={data.Deskripsi}></Textarea>
                        <Spacer />
                        <Text size={14}>Gambar Sebelumnya</Text>
                        <img src={`${data.Image}`}></img>
                        <Spacer />
                        <Input label="Ubah Gambar" type={'file'} />
                    </Card.Body>
                    <Card.Divider />
                    <Card.Footer>
                        <Row justify="flex-end">
                            <Button disabled={disable} size="sm" color="error" className="mr-4"
                                onClick={() => router.push('/Artikel')}>
                                Batal
                            </Button>
                            <Button disabled={disable} type="submit" size="sm" color="success">Ubah Data</Button>
                        </Row>
                    </Card.Footer>
                </form>
            </Card>
            {/* <h1 dangerouslySetInnerHTML={{ __html: 'hello <br> there' }}  ></h1> */}
        </div >
    )
}

export default ArtikelDetail