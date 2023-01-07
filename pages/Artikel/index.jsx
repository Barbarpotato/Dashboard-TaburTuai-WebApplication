import { useEffect, Suspense, useState } from 'react'
import { useRouter } from 'next/router'
import { Table, Modal, Button, Text } from "@nextui-org/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { db } from '../../firebase/config'
import {
    collection, deleteDoc, doc, addDoc,
    orderBy, query, onSnapshot, serverTimestamp
} from 'firebase/firestore'
import dynamic from 'next/dynamic';

export default function Artikel() {
    //? Dyanamic Import
    const { push } = useRouter()

    const [visible, setVisible] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [artikel, setArtikel] = useState([])
    const [detail, setDetail] = useState({ Judul: '', doc_id: '', Deskripsi: '' });

    const Navigasi = dynamic(() => import("../../Components/Navigasi"))

    const handleCreateArtikel = () => {
        push('/Artikel/Create')
    }

    const handler = (idx) => {
        //? fill the detail state wirh specific doc.
        setDetail(artikel[idx])
        setVisible(true)
    }

    const closeHandler = () => {
        setVisible(false)
    }

    const handleEdit = (doc_id) => {
        //? doc_id was from the detail.doc_id
        setVisible(false)
        //? redirect to the dynamic routes.
        push(`/Artikel/${doc_id}`)
    };

    const handleDelete = (doc_id, judul) => {
        //? doc_id was from the detail.doc_id
        (async () => {
            try {
                const date = new Date()
                const ArtikelRef = doc(db, 'Artikel', doc_id)
                await deleteDoc(ArtikelRef)
                const riwayatRef = collection(db, 'Riwayat')
                await addDoc(riwayatRef, {
                    Deskripsi: `Penghapusan Artikel dengan Judul ${judul}`,
                    Timestamp: serverTimestamp(),
                    Waktu: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate(),
                    Tipe: 'Delete'
                })
                setRefresh(!refresh)
                alert('Berhasil Hapus Data')
            } catch (err) {
                alert('Gagal Menghapus Data')
            }
        })()
        setVisible(false)
    }

    useEffect(() => {
        if (!sessionStorage.getItem('isAuth')) push('/');
        //? Read all Artikel Data from Firestore.
        (async () => {
            try {
                let dataArr = []
                const colRef = query(collection(db, 'Artikel'), orderBy('Timestamp'))
                onSnapshot(colRef, (querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data()
                        data.doc_id = doc.id
                        dataArr.push(data)
                    })
                    setArtikel(dataArr.reverse())
                })
            } catch (err) {

            }
        })()
    }, [refresh]);

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Navigasi />
            </Suspense>
            <main className='m-2'>
                <Modal
                    closeButton
                    blur
                    scroll
                    aria-labelledby="modal-title"
                    open={visible}
                    onClose={closeHandler}
                >
                    <Modal.Header>
                        <Text b size={25}>
                            Pengaturan Data
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Waktu Publish: {detail.Waktu}</Text>
                        <Text>Judul Artikel: {detail.Judul}</Text>
                        <Text className='text-justify'>Deskripsi Judul: <br></br>{detail.Deskripsi}</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button auto flat color="success" onClick={() => handleEdit(detail.doc_id)}>
                            Ubah Data
                        </Button>
                        <Button auto flat color="error" onClick={() => handleDelete(detail.doc_id, detail.Judul)}>
                            Hapus Data
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Button css={{ marginTop: '25px', marginBottom: '25px' }} color={'success'} size="sm"
                    onClick={handleCreateArtikel}>
                    Buat Artikel
                </Button>
                <Table
                    aria-label="Example static collection table"
                    css={{
                        backgroundColor: 'white',
                        color: 'white',
                        width: '80vw'
                    }}
                >
                    <Table.Header className="bg-red-900">
                        <Table.Column>Judul</Table.Column>
                        <Table.Column>Waktu Publikasi</Table.Column>
                        <Table.Column>Pengaturan</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {artikel.map((item, idx) => (
                            <Table.Row key={idx}>
                                <Table.Cell>{item.Judul}</Table.Cell>
                                <Table.Cell>{item.Waktu}</Table.Cell>
                                <Table.Cell><button onClick={() => handler(idx)}><BiDotsHorizontalRounded /></button></Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </main >
        </div>
    )
}