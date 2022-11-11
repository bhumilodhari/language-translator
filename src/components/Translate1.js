import React, { useState, useEffect, useCallback } from 'react';
import "./Translate.css";
import axios from 'axios';
import { FiCopy } from 'react-icons/fi';
import { FaExchangeAlt } from 'react-icons/fa';
import { AiOutlineSound, AiOutlineClose } from 'react-icons/ai';
import languageNames from '../utils/languageCode';
import { TextField } from '@mui/material';

export default function TranslateLang() {
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');
    const [languagesList, setLanguagesList] = useState([]);
    const [selectedLanguageKey, setLanguageKey] = useState(navigator.language);
    const [resultedLanguageKey, setResultedLanguageKey] = useState('hi');
    const apiKey = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;

    const translateText = useCallback(() => {
        let data = {
            q: inputText,
            source: selectedLanguageKey,
            target: resultedLanguageKey
        }
        axios.post(`https://translation.googleapis.com/language/translate/v2/?key=${apiKey}`, data)
            .then((response) => {
                setResultText(response.data.data.translations[0].translatedText)
            })
    }, [apiKey, inputText, resultedLanguageKey, selectedLanguageKey])

    const exchangeHandlar = () => {
        const tempText = inputText;
        const tempLang = selectedLanguageKey;
        setInputText(resultText);
        setResultText(tempText);
        setLanguageKey(resultedLanguageKey);
        setResultedLanguageKey(tempLang);
    }

    const sound = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    }

    useEffect(() => {
        setResultText('Translating...')
        const to = setTimeout(() => {
            translateText()
        }, 400)
        return () => {
            clearTimeout(to)
        }
    }, [translateText]);

    useEffect(() => {
        axios.get(`https://translation.googleapis.com/language/translate/v2/languages?key=${apiKey}`)
            .then((response) => {
                setLanguagesList(response.data.data.languages.map((language) => ({ code: language.language, languageName: languageNames.of(language.language) })))
            })
    }, [apiKey]);

    return (
        <div>
            <h1>Language Translator</h1>
            <ul className='controls'>
                <li>
                    <select
                        className="language-select"
                        onChange={(e) => setLanguageKey(e.target.value)}
                        value={selectedLanguageKey}
                    >
                        {languagesList.map((language) => {
                            return (
                                <option value={language.code}>
                                    {language.languageName}
                                </option>
                            )
                        })}
                    </select>
                </li>
                <li>
                    <select
                        className="language-select"
                        onChange={(e) => setResultedLanguageKey(e.target.value)}
                        value={resultedLanguageKey}
                    >
                        {languagesList.map((language) => {
                            return (
                                <option key={language.code} value={language.code}>
                                    {language.languageName}
                                </option>
                            )
                        })}
                    </select>
                </li>
            </ul>
            <div className='app-body'>
                <div className='wrapper'>
                    <div className='text-container'>
                        <br />
                        <TextField
                            id="outlined-basic"
                            label="Outlined"
                            variant="outlined"
                            placeholder='Enter Text'
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />

                        <TextField
                            value={resultText}
                        />
                    </div>
                </div>
                <div className='icon-wrapper'>
                    <ul className='controls'>
                        <li>
                            <FiCopy onClick={() => navigator.clipboard.writeText(inputText)} />
                        </li>
                        <li>
                            <AiOutlineSound onClick={() => sound(inputText)} />
                        </li>
                        <li><AiOutlineClose onClick={() => setInputText('')} /></li>
                        <li className='exchange'>
                            <FaExchangeAlt onClick={exchangeHandlar} />
                        </li>
                        <li>
                            <AiOutlineSound onClick={() => sound(resultText)} />
                        </li>
                        <li>
                            <FiCopy onClick={() => navigator.clipboard.writeText(resultText)} />
                        </li>
                    </ul>
                </div>
            </div>
        </div >
    )
}
