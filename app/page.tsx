"use client";

import React, { useState } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';

export default function Home() {
  return (
    <>
      <Header />
      <main className='container mx-auto p-4 mt-20'>
        <MainContent />
      </main>
    </>
  )
}
