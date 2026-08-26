"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleForm = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Registration failed")
        setLoading(false)
        return
      }

      alert(data.message || "User created successfully!")
      setLoading(false)
      router.push("/login")
    } catch (error) {
      console.error("Fetch Error:", error)
      alert("Network error: " + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-amber-50 flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-amber-950">
        Register plz
      </h1>

      <form
        onSubmit={handleForm}
        className="bg-amber-950 w-full max-w-md p-6 sm:p-8 rounded-2xl flex flex-col justify-center gap-4 shadow-2xl"
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="enter ur name"
          className="bg-white w-full py-2 px-4 rounded-xl text-center border-4 font-bold border-amber-600 focus:outline-none"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter ur Email"
          className="bg-white w-full py-2 px-4 rounded-xl text-center border-4 font-bold border-amber-600 focus:outline-none"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter ur Password"
          className="bg-white w-full py-2 px-4 rounded-xl text-center border-4 font-bold border-amber-600 focus:outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-500 text-amber-950 font-bold w-full py-2.5 rounded-xl shadow-[4px_10px_19px_#000] transition active:scale-95 disabled:opacity-50 mt-2"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-white text-sm sm:text-base">
          <p>Already Have account?</p>
          <Link href="/login">
            <span className="text-amber-500 font-bold decoration-2 decoration-amber-600 underline hover:text-amber-400">
              Login now
            </span>
          </Link>
        </div>
      </form>
    </div>
  )
}
