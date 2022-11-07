import React, { useState, useEffect, useCallback } from 'react';
import {
    Form,
    TextArea,
    Button,
} from 'semantic-ui-react';
import "./Translate.css";
import axios from 'axios';
import { FiCopy } from 'react-icons/fi';
import { FaExchangeAlt } from 'react-icons/fa';
// import { Translate } from '@google-cloud/translate/build/src/v2';

// const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
// const translate = new Translate();

// async function listLanguages() {
//     // Lists available translation language with their names in English (the default).
//     const [languages] = await translate.getLanguages();

//     console.log('Languages:');
//     languages.forEach(language => console.log(language));
// }

// listLanguages();

export default function TranslateLang() {
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');
    const [selectedLanguageKey, setLanguageKey] = useState('hi');
    const [languagesList, setLanguagesList] = useState([]);
    const [detectLanguageKey, setdetectedLanguageKey] = useState('');

    const getLanguageSource = useCallback(() => {
        axios.post(`https://libretranslate.de/detect`, {
            q: inputText
        })
            .then((response) => {
                setdetectedLanguageKey(response.data[0].language)
            })
    }, [inputText])
    const translateText = () => {
        setResultText(inputText)

        getLanguageSource();

        let data = {
            q: inputText,
            source: detectLanguageKey,
            target: selectedLanguageKey
        }
        axios.post(`https://libretranslate.de/translate`, data)
            .then((response) => {
                setResultText(response.data.translatedText)
            })
    }

    const languageKey = (selectedLanguage) => {
        setLanguageKey(selectedLanguage.target.value)
    }

    const exchangeHandlar = () => {
        // let tempText = setResultText;
        // let tempLang = selectedLanguagekey;
        // setResultText = resultText;
        // resultText = tempText;

    }

    const copyHandlar = () => {

    }

    useEffect(() => {
        axios.get(`https://libretranslate.de/languages`)
            .then((response) => {
                setLanguagesList(response.data)
            })

        getLanguageSource()
    }, [inputText, getLanguageSource]);

    return (
        <div>
            <div>
                <h1 className="header">Language Translator</h1>
            </div>
            <div className='app-body'>
                <div>
                    <Form>
                        <div className='wrapper'>
                            <div className='text-container'>
                                <Form.Field
                                    control={TextArea}
                                    placeholder='Enter Text'
                                    onChange={(e) => setInputText(e.target.value)}
                                />

                                <Form.Field
                                    control={TextArea}
                                    value={resultText}
                                />
                            </div>
                        </div>
                        <div className='icon-wrapper'>
                            <ul className='controls'>
                                <li>
                                    <select
                                        className="language-select"
                                        onChange={languageKey}
                                    >
                                        {languagesList.map((language) => {
                                            // console.log(language.code)
                                            return (
                                                <option value={language.code}>
                                                    {language.name}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </li>
                                <li>
                                    <FiCopy onClick={copyHandlar} />
                                </li>
                                <li className='exchange'>
                                    <FaExchangeAlt onClick={exchangeHandlar} />
                                </li>
                                <li>
                                    <FiCopy onClick={copyHandlar} />
                                </li>
                                <li className=''>
                                    <select
                                        className="language-select"
                                        onChange={languageKey}
                                    >
                                        {languagesList.map((language) => {
                                            return (
                                                <option key={language.code} selected={language.code === 'hi'} value={language.code}>
                                                    {language.name}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <Button basic color='blue' onClick={translateText}>Translate</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
