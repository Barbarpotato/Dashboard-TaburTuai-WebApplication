import { Card, Text, Button, Row, Input, Textarea, Spacer } from "@nextui-org/react";
import { db, storage } from '../../firebase/config'
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router"
import { useState } from "react";

export default function Create() {

    const { push } = useRouter()

    const [disable, setDisable] = useState(false)

    const handleSubmit = (event) => {
        //? Upload Image.
        event.preventDefault()
        setDisable(true)
        const imgFile = event.target[2]?.files[0]
        const storageRef = ref(storage, `artikel/${imgFile.name}`)
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
                            //? Artikel Collection
                            const text = String(event.target[1].value)
                            const formattedHTML = text.replace(/\r|\n/g, '<br>')
                            const date = new Date()
                            const artikelRef = collection(db, 'Artikel')
                            await addDoc(artikelRef, {
                                Judul: event.target[0].value,
                                Deskripsi: formattedHTML,
                                Image: downloadURL,
                                ImageLocation: `artikel/${imgFile.name}`,
                                Timestamp: serverTimestamp(),
                                Waktu: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate(),
                            })
                            //? Riwayat Collection
                            const riwayatRef = collection(db, 'Riwayat')
                            await addDoc(riwayatRef, {
                                Deskripsi: `Penambahan Artikel dengan Judul ${event.target[0].value}`,
                                Timestamp: serverTimestamp(),
                                Waktu: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate(),
                                Tipe: 'Create'
                            })
                            alert('Publikasi Artikel Berhasil')
                            push('/Artikel')
                        } catch (err) {
                            alert('Gagal Publikasikan Artikel')
                            push('/Artikel')
                        }
                    })()
                });
            }
        );
    }

    return (
        <div className="flex flex-row justify-center mt-[5%]">
            {/* <h1>{data.Judul} {ArtikelId}</h1> */}
            <Card css={{ width: "100vh" }}>
                <Card.Header>
                    <Text b>Buat Data Artikel</Text>
                </Card.Header>
                <Card.Divider />
                <form onSubmit={handleSubmit}>
                    <Card.Body css={{ py: "$10" }}>
                        <Input required label="Judul Artikel"></Input>
                        <Spacer />
                        <Textarea required css={{ width: '100%' }} name="deskripsi" label="Deksripsi Artikel"
                            initialValue={''}></Textarea>
                        <Spacer />
                        <Input required label="Upload Gambar" type={'file'}></Input>
                    </Card.Body>
                    <Card.Divider />
                    <Card.Footer>
                        <Row justify="flex-end">
                            <Button disabled={disable} size="sm" color="error" className="mr-4"
                                onClick={() => push('/Artikel')}>
                                Batal
                            </Button>
                            <Button disabled={disable} type="submit" size="sm" color="success">Publikasi Artikel</Button>
                        </Row>
                    </Card.Footer>
                </form>
            </Card>
        </div >
    )
}