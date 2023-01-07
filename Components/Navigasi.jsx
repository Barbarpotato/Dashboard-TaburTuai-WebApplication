import { Text, useModal, Modal } from "@nextui-org/react"
import Link from 'next/link'
import { BiMenu } from "react-icons/bi";

export default function Navigasi() {

    const { setVisible, bindings } = useModal();

    return (
        <div>
            <div className="p-8 flex flex-row bg-[rgb(8,90,67)]">
                <Text color='white' className="font-bold text-xl">Tabur Tuai Dashboard</Text>
                <button onClick={() => setVisible(true)} className="absolute right-0 mr-4 "><BiMenu color="white" size={20} /></button>
            </div>
            <Modal
                css={{ backgroundColor: 'rgb(8,90,67)' }}
                height="600px"
                closeButton
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                {...bindings}
            >
                <Modal.Header>
                    <Text color="white"
                        className="font-bold text-3xl"
                        size={25}>
                        Navigasi
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text
                        className="text-2xl py-4"
                        color="white">
                        <Link href={'/Beranda'}>Beranda</Link>
                    </Text>
                    <Text
                        className="text-2xl py-4"
                        color="white">
                        <Link href={'/Artikel'}>
                            Artikel
                        </Link>
                    </Text>
                    <Text
                        className="text-2xl py-4"
                        color="white">
                        <Link href={'/Formulir'}>Formulir</Link>
                    </Text>
                </Modal.Body>
            </Modal>
        </div >
    )
}