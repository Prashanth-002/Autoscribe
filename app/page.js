"use client"
import { Button } from "@/components/ui/button"
import { UserButton, useUser } from "@clerk/nextjs"
import{ useMutation } from "convex/react";
import {api } from "@/convex/_generated/api"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function Home() {

  const {user}=useUser();
  const createUser=useMutation(api.user.createUser);
  const router = useRouter();

    const fullName =user?.fullName ||`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Anonymous';

  useEffect(()=>{
    user&&CheckUser();
   },[user])

  const CheckUser=async()=>{
    const result=await createUser({
      email:user?.primaryEmailAddress?.emailAddress,
      imageUrl:user?.imageUrl,
      userName:fullName,
      upgrade:false
    })

    console.log(result);
  }



    const handleAuthRedirect = () => {
    if (user) {
      // If already logged in, maybe send to dashboard
      router.push("/dashboard");
    } else {
      // If not logged in, go to signup/signin page
      router.push("/sign-up"); // or "/auth/signup"
    }
  };


  return (
    <div>
      {/* <h1>Hello</h1>
      <Button onClick={handleAuthRedirect}> Get Started</Button>

      <UserButton/> */}

      {/* <Button onClick={handleAuthRedirect}> Get Started</Button> */}

     <>
  <meta charSet="utf-8" />
  <meta content="width=device-width, initial-scale=1" name="viewport" />
  <title>
    AutoScribe-Personal Generative AI Note Assistant &amp; Animations
  </title>
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\n   body {\n      font-family: "Poppins", sans-serif;\n      overflow-x: hidden;\n    }\n    /* Background animated circles */\n    .bg-animate-circle {\n      position: absolute;\n      border-radius: 50%;\n      opacity: 0.15;\n      filter: blur(40px);\n      animation-timing-function: ease-in-out;\n      animation-iteration-count: infinite;\n      animation-direction: alternate;\n    }\n    .circle1 {\n      width: 300px;\n      height: 300px;\n      background: #e63946;\n      top: 10%;\n      left: -100px;\n      animation-name: move1;\n      animation-duration: 8s;\n    }\n    .circle2 {\n      width: 400px;\n      height: 400px;\n      background: #3a5afc;\n      top: 50%;\n      right: -150px;\n      animation-name: move2;\n      animation-duration: 10s;\n    }\n    .circle3 {\n      width: 250px;\n      height: 250px;\n      background: #f1faee;\n      top: 70%;\n      left: 20%;\n      animation-name: move3;\n      animation-duration: 12s;\n    }\n    @keyframes move1 {\n      0% { transform: translateY(0) translateX(0) scale(1); }\n      100% { transform: translateY(20px) translateX(20px) scale(1.1); }\n    }\n    @keyframes move2 {\n      0% { transform: translateY(0) translateX(0) scale(1); }\n      100% { transform: translateY(-25px) translateX(-25px) scale(1.05); }\n    }\n    @keyframes move3 {\n      0% { transform: translateY(0) translateX(0) scale(1); }\n      100% { transform: translateY(15px) translateX(15px) scale(1.1); }\n    }\n    /* Fade in animation for main content */\n    .fade-in {\n      opacity: 0;\n      animation: fadeInAnim 1.2s forwards;\n      animation-delay: 0.3s;\n    }\n    @keyframes fadeInAnim {\n      to {\n        opacity: 1;\n      }\n    }\n    /* Button hover scale */\n    .btn-animate:hover {\n      transform: scale(1.05);\n      transition: transform 0.3s ease;\n    }\n    /* Card hover shadow and scale */\n    .card-animate {\n      transition: transform 0.3s ease, box-shadow 0.3s ease;\n    }\n    .card-animate:hover {\n      transform: translateY(-8px);\n      box-shadow: 0 15px 25px rgba(0,0,0,0.15);\n    }\n  '
    }}
  />
  <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-100 to-gray-200 overflow-hidden">
    {/* Background animated circles */}
    <div aria-hidden="true" className="bg-animate-circle circle1" />
    <div aria-hidden="true" className="bg-animate-circle circle2" />
    <div aria-hidden="true" className="bg-animate-circle circle3" />
    <header className="fade-in flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full z-10 relative">
      <div className="flex items-center space-x-2">
      <Image src={'/next1.svg'} alt="logo" width={220} height={220} className="rounded-full" />
      </div>
      <nav className="hidden md:flex space-x-8 text-gray-900 font-semibold text-md justify-center items-center ">
        <a className="hover:underline" href="#">
          Features
        </a>
        <a className="hover:underline" href="#">
          Solution
        </a>
        <a className="hover:underline" href="#">
          Testimonials
        </a>
        <a className="hover:underline" href="#">
          Blog
        </a>
        <Button onClick={handleAuthRedirect} className='bg-gray-900 text-white rounded-full px-6 py-3 font-semibold text-sm hover:bg-gray-800 transition btn-animate'> Get Started
        </Button>
        <UserButton className='w-5 h-5' />
        
      </nav>
    </header>
    <main className="fade-in flex-grow flex flex-col justify-center items-center px-6 text-center max-w-4xl mx-auto relative z-10">
      <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight text-gray-900 max-w-4xl mt-10">
        Simplify
        <span className="text-red-600">PDF</span>
        <span className="text-blue-600">Note</span>
        <span>-Taking with AI-Powered</span>
      </h1>
      <p className="mt-4 max-w-xl text-gray-700 text-sm sm:text-base font-normal">
        Elevate your note-taking experience with our AI-powered PDF app.
        Seamlessly extract key insights, summaries, and annotations from any PDF
        with just a few clicks
      </p>
      <div className="mt-8 flex space-x-4 justify-center">
        <button onClick={handleAuthRedirect} className="bg-gray-900 text-white rounded-full px-6 py-3 font-semibold text-sm hover:bg-gray-800 transition btn-animate">
          Get started
        </button>
        <button className="bg-gray-300 text-gray-900 rounded-full px-6 py-3 font-semibold text-sm hover:bg-gray-400 transition btn-animate">
          Learn more
        </button>
      </div>
      <section className="mt-16 w-full max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white rounded-lg shadow-md p-6 card-animate">
            <h3 className="font-semibold text-gray-900 mb-2">
              The lowest price
            </h3>
            <p className="text-gray-700">AutoScribe offers the most affordable solution for smart document summarization.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 card-animate">
            <h3 className="font-semibold text-gray-900 mb-2">
              The fastest on the market
            </h3>
            <p className="text-gray-700">AutoScribe delivers lightning-fast performance so you never waste time waiting.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 card-animate">
            <h3 className="font-semibold text-gray-900 mb-2">The most loved</h3>
            <p className="text-gray-700">AutoScribe combines accuracy, simplicity, and reliability for an unmatched experience.</p>
          </div>
        </div>
      </section>
    </main>
    <footer className="bg-gray-900 text-gray-300 mt-16 py-10 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h4 className="font-semibold text-white mb-3">Contact Us</h4>
          <p>Email: autoscribe@gmail.com</p>
          <p>Phone: +91 987654321</p>
          <p>Address: 123 PDF St, Note City, CA 90210</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Follow Us</h4>
          <div className="flex space-x-4 text-xl">
            <a aria-label="Facebook" className="hover:text-white" href="#">
              <i className="fab fa-facebook-f" />
            </a>
            <a aria-label="Twitter" className="hover:text-white" href="#">
              <i className="fab fa-twitter" />
            </a>
            <a aria-label="LinkedIn" className="hover:text-white" href="#">
              <i className="fab fa-linkedin-in" />
            </a>
            <a aria-label="Instagram" className="hover:text-white" href="#">
              <i className="fab fa-instagram" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a className="hover:underline" href="#">
                Features
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#">
                Solution
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#">
                Testimonials
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#">
                Blog
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</>


    </div>
  )
}