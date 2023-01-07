import { Card, Text, Spacer, Row } from "@nextui-org/react";
import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/router';
import { db } from './../firebase/config'
import { BiX } from "react-icons/bi";
import { collection, orderBy, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import dynamic from 'next/dynamic';

export default function Beranda() {

    const { push } = useRouter();
    const [empty, setEmpty] = useState(false)
    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(false)

    const Navigasi = dynamic(() => import("../Components/Navigasi"))

    const handleDelete = (doc_id) => {
        (async () => {
            try {
                const riwayatRef = doc(db, 'Riwayat', doc_id)
                await deleteDoc(riwayatRef)
                setRefresh(!refresh)
            } catch (err) { }
        })()
    }

    useEffect(() => {
        if (!sessionStorage.getItem('isAuth')) push('/');
        (async () => {
            try {
                let dataArr = []
                const riwayatRef = query(collection(db, 'Riwayat'), orderBy('Timestamp'))
                onSnapshot(riwayatRef, (querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data()
                        data.doc_id = doc.id
                        dataArr.push(data)
                    })
                    setData(dataArr.reverse())
                    if (dataArr.length == 0) setEmpty(true)
                })
            } catch (err) { }
        })()
    }, [refresh]);


    if (empty) {
        return (
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <Navigasi />
                </Suspense>
                <div className="flex flex-col items-center justify-center h-screen">
                    <img width={280} height={280} src="https://firebasestorage.googleapis.com/v0/b/taburtuai-4a8bf.appspot.com/o/Content%2FNoData.jpg?alt=media&token=20f8ce76-4c1c-468f-8590-04faa895b3b6" />
                    <Text className="text-3xl px-16 text-center font-semibold">Tidak Ada Riwayat Data Saat ini</Text>
                </div>
            </div >)
    }

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Navigasi />
            </Suspense>
            <main className="m-8 flex flex-col items-center">
                <Text className="text-2xl font-semibold py-8 opacity-70">Riwayat Pengaturan Data</Text>
                {data.map((item) => {
                    switch (item.Tipe) {
                        case 'Create':
                            return (
                                <Card isHoverable variant="bordered" css={{ opacity: 0.7, backgroundColor: '#17c964', marginBottom: '25px' }}>
                                    <Row justify="flex-end">
                                        <button onClick={() => handleDelete(item.doc_id)}><BiX size={25} color='white' /></button>
                                    </Row>
                                    <Card.Body>
                                        <Text color="white">{`Waktu : ${item.Waktu}`}</Text>
                                        <Spacer />
                                        <Text weight={'bold'} color="white">{item.Deskripsi}</Text>
                                    </Card.Body>
                                </Card>
                            )
                        case 'Delete':
                            return (
                                <Card isHoverable variant="bordered" css={{ opacity: 0.7, backgroundColor: 'red', color: 'white', marginBottom: '25px' }}>
                                    <Row justify="flex-end">
                                        <button onClick={() => handleDelete(item.doc_id)}><BiX size={25} color='white' /></button>
                                    </Row>
                                    <Card.Body>
                                        <Text color="white">{`Waktu : ${item.Waktu}`}</Text>
                                        <Spacer />
                                        <Text weight={'bold'} color="white">{item.Deskripsi}</Text>
                                    </Card.Body>
                                </Card>
                            )
                        case 'Update':
                            return (
                                <Card isHoverable variant="bordered" css={{ opacity: 0.7, backgroundColor: 'rgba(0,114,245,255)', color: 'white', marginBottom: '25px' }}>
                                    <Row justify="flex-end">
                                        <button onClick={() => handleDelete(item.doc_id)}><BiX size={25} color='white' /></button>
                                    </Row>
                                    <Card.Body>
                                        <Text color="white">{`Waktu : ${item.Waktu}`}</Text>
                                        <Spacer />
                                        <Text weight={'bold'} color="white">{item.Deskripsi}</Text>
                                    </Card.Body>
                                </Card>
                            )
                    }
                })}
            </main >
        </div>
    )
}