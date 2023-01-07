import { Table, Modal, Button, Text } from "@nextui-org/react";
import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/router';
import { db } from '../../firebase/config'
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore'
import { BiDotsHorizontalRounded } from "react-icons/bi";
import dynamic from 'next/dynamic';

export default function Formulir() {

    const { push } = useRouter()

    const [visible, setVisible] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [data, setData] = useState([])
    const [detail, setDetail] = useState({})

    const Navigasi = dynamic(() => import("../../Components/Navigasi"))

    const handler = (object) => {
        setDetail(object)
        setVisible(true)
    }

    const closeHandler = () => {
        setVisible(false)
    }

    const handleDelete = (doc_id, Nama) => {
        (async () => {
            try {
                const date = new Date()
                const formRef = doc(db, 'Formulir', doc_id)
                await deleteDoc(formRef)
                setDetail({ Judul: '', doc_id: '', Deskripsi: '' })
                const riwayatRef = collection(db, 'Riwayat')
                await addDoc(riwayatRef, {
                    Deskripsi: `Penghapusan Kontak Formulir dengan Nama ${Nama}`,
                    Timestamp: serverTimestamp(),
                    Waktu: date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate(),
                    Tipe: 'Delete'
                })
                alert('Berhasil Hapus Data')
                setRefresh(!refresh)
            } catch (err) {
                alert('Gagal Menghapus Data')
            }
        })()
    }

    useEffect(() => {
        if (!sessionStorage.getItem('isAuth')) push('/');
        (async () => {
            try {
                let dataArr = []
                const formRef = collection(db, 'Formulir')
                const snapshot = await getDocs(formRef)
                snapshot.forEach((doc) => {
                    const data = doc.data()
                    data.doc_id = doc.id
                    dataArr.push(data)
                })
                setData(dataArr)
            }
            catch (err) {
                router.push('/')
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
                            Detail Data
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Nama: {detail.Nama}</Text>
                        <Text>Email: {detail.Email}</Text>
                        <Text>Telpon: {detail.Telpon}</Text>
                        <Text>Pesan: {detail.Pesan}</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button auto flat color="error" onClick={() => {
                            closeHandler()
                            handleDelete(detail.doc_id, detail.Nama)
                        }
                        } >
                            Hapus Data
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Table
                    aria-label="Example static collection table"
                    css={{
                        backgroundColor: 'white',
                        color: 'white',
                        width: '80vw'
                    }}
                >
                    <Table.Header className="bg-red-900">
                        <Table.Column>Nama</Table.Column>
                        <Table.Column>Waktu Pengiriman</Table.Column>
                        <Table.Column>Pengaturan</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {data.map((item, idx) => (
                            <Table.Row key={idx}>
                                <Table.Cell>{item.Nama}</Table.Cell>
                                <Table.Cell>{item.Waktu}</Table.Cell>
                                <Table.Cell><button onClick={() => {
                                    handler({
                                        doc_id: item.doc_id,
                                        Nama: item.Nama, Telpon: item.Telpon,
                                        Email: item.Email, Pesan: item.Pesan
                                    })
                                }}><BiDotsHorizontalRounded /></button></Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </main>
        </div>
    )
}