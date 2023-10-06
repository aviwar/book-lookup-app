"use client";

import React, { useEffect, useState } from "react";

const MainContent = () => {
    const [query, setQuery] = useState<string>('');
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    useEffect(() => {
        filterBooks();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [books, selectedFormat, selectedLanguage, selectedSubject]);

    const handleSearch = async () => {
        try {
            setLoading(true);

            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`https://gutendex.com/books/?search=${encodedQuery}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data')
            }

            const result = await response.json();
            setBooks(result?.results);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterBooks = () => {
        let filtered = [...books];

        if (selectedFormat) {
            filtered = filtered.filter((book) =>
                Object.keys(book.formats).some((formatKey) => {
                    return formatKey === selectedFormat;
                })
            );
        }

        if (selectedLanguage) {
            filtered = filtered.filter((book) =>
                book.languages.includes(selectedLanguage)
            );
        }

        if (selectedSubject) {
            const selectedSubjectLower = selectedSubject.toLowerCase();
            filtered = filtered.filter((book) =>
                book.subjects.some((subject: string) =>
                    subject.toLowerCase().includes(selectedSubjectLower)
                )
            );
        }

        setFilteredBooks(filtered);
    }

    return (
        <>
            <div className="text-center">
                <input
                    type="text"
                    placeholder="Search books..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            <hr className="mt-4"/>

            <div className="mt-4">
                <div className="flex items-center">
                    <label className="px-2 block mb-2 font-semibold mr-2">Filter By:</label>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={selectedFormat || ""}
                        onChange={(e) => setSelectedFormat(e.target.value || null)}
                    >
                        <option value="">All Formats</option>
                        <option value="text/html">HTML</option>
                        <option value="application/epub+zip">ePub</option>
                        <option value="image/jpeg">JPEG</option>
                        <option value="text/plain">Plain</option>
                    </select>
                    <span className="border-r border-gray-300 mx-2 h-6"></span>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={selectedLanguage || ""}
                        onChange={(e) => setSelectedLanguage(e.target.value || null)}
                    >
                        <option value="">All Languages</option>
                        <option value="en">English</option>
                        <option value="fr">French</option>
                    </select>
                    <span className="border-r border-gray-300 mx-2 h-6"></span>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={selectedSubject || ""}
                        onChange={(e) => setSelectedSubject(e.target.value || null)}
                    >
                        <option value="">All Subjects</option>
                        <option value="science">Science</option>
                        <option value="fiction">Fiction</option>
                        <option value="drama">Drama</option>
                    </select>
                </div>
            </div>

            <div className="mt-8 border p-4 bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {
                    filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="bg-white border border-gray-300 rounded-lg p-4 shadow-md"
                            >
                                <h3 className="text-lg font-semibold">{book.title}</h3>
                                <p className="text-sm text-gray-600">
                                    {book.authors.map((author: any) => author.name).join(', ')}
                                </p>
                            </div>
                        ))
                    ) : (
                        <span>No results found!</span>
                    )
                }

            </div>
        </>
    )
}

export default MainContent;
