import { Input, Spacer, Text, Button } from "@nextui-org/react"
import { useRouter } from 'next/router';

export default function Home() {
  const { push } = useRouter()

  const redirectToBeranda = () => {
    push('/Beranda')
  }

  const handleAuth = (event) => {
    event.preventDefault()
    const username = 'darmajr94'
    const password = 'hahaha123'
    if (event.target[0].value === username && event.target[1].value === password) {
      sessionStorage.setItem('isAuth', true)
      redirectToBeranda()
    } else alert('Username atau Password Salah!')
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <form onSubmit={handleAuth} className="flex flex-col w-96 ">
        <Spacer y={1.5} />
        <Text
          h1
          className='text-center font-bold text-4xl'>Selamat Datang</Text>
        <Spacer y={1.5} />
        <Input
          size="xl"
          placeholder="Full Name" />
        <Spacer y={1.5} />
        <Input.Password
          size="xl"
          placeholder="Password"
          initialValue="" />
        <Spacer y={1.5} />
        <Button
          className="bg-green-600 text-white"
          type='submit'
          size="xl"
          shadow
          color="rgba(25,28,37,255)" auto>
          Masuk
        </Button>
      </form>
    </div >
  )
}
