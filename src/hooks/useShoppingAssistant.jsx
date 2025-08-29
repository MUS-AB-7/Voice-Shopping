import { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { findCategory } from "../data/categories";
import { getSeasonalSuggestions } from "../data/seasonal";
import { substituteMap } from "../data/substitutes";
import { mockProducts } from "../data/mockProducts";

const COMMANDS = {
  ADD: ["add", "buy", "need", "want", "get"],
  REMOVE: ["remove", "delete", "drop", "cut"],
  MODIFY: ["change", "set", "update", "modify"],
  SEARCH: ["find", "search", "look for"],
  CLEAR: ["clear", "reset", "empty", "start over"],
};
const numberWords = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };

export default function useShoppingAssistant(language = "en-IN") {
  const [shoppingList, setShoppingList] = useState([]);
  const [suggestions, setSuggestions] = useState({ seasonal: [], history: [], substitute: null });
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [command, setCommand] = useState("");
  const lastProcessedTranscript = useRef("");

  const { transcript, listening, resetTranscript, finalTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    try {
      const storedList = localStorage.getItem("shoppingList");
      if (storedList) setShoppingList(JSON.parse(storedList));
    } catch (err) { console.error("Failed to load list", err); }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    } catch (err) { console.error("Failed to save list", err); }
    generateSuggestions();
  }, [shoppingList]);

  useEffect(() => {
    if (finalTranscript && finalTranscript !== lastProcessedTranscript.current) {
      lastProcessedTranscript.current = finalTranscript;
      setLoading(true);
      setError("");
      setCommand("");
      setSearchResults([]);
      processCommand(finalTranscript);
      resetTranscript();
      setTimeout(() => setLoading(false), 500);
    }
  }, [finalTranscript]);

  const processCommand = (text) => {
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const commandWord = words.find(w => Object.values(COMMANDS).flat().includes(w));

    if (!commandWord) {
      setError("Command not recognized. Try 'add', 'remove', 'change', or 'find'.");
      return;
    }

    let action;
    if (COMMANDS.ADD.includes(commandWord)) action = 'ADD';
    if (COMMANDS.REMOVE.includes(commandWord)) action = 'REMOVE';
    if (COMMANDS.MODIFY.includes(commandWord)) action = 'MODIFY';
    if (COMMANDS.SEARCH.includes(commandWord)) action = 'SEARCH';
    if (COMMANDS.CLEAR.includes(commandWord)) action = 'CLEAR';

    const commandIndex = words.indexOf(commandWord);
    let phrase = words.slice(commandIndex + 1);

    let quantity = 1;

    const numberAsWord = phrase.find(w => numberWords[w]);
    const numberAsDigit = phrase.find(w => !isNaN(parseInt(w)));
    let numberToRemove = null;

    if (numberAsWord) {
      quantity = numberWords[numberAsWord];
      numberToRemove = numberAsWord;
    } else if (numberAsDigit) {
      quantity = parseInt(numberAsDigit);
      numberToRemove = numberAsDigit;
    }
    
    if(numberToRemove) {
        const numberIndex = phrase.indexOf(numberToRemove);
        if(phrase[numberIndex - 1] === 'to'){
            phrase.splice(numberIndex - 1, 2);
        } else {
            phrase.splice(numberIndex, 1);
        }
    }
    const item = phrase.join(" ").replace(/s$/, "").trim();

    switch (action) {
      case 'ADD': handleAddItem({ name: item, quantity }); break;
      case 'REMOVE': handleRemoveItem({ name: item, quantity }); break;
      case 'MODIFY': handleModifyItem({ name: item, quantity }); break;
      case 'SEARCH': handleSearch(phrase.join(" ")); break;
      case 'CLEAR': handleClearList(); break;
      default: setError("Could not determine action.");
    }
  };

  const handleAddItem = ({ name, quantity }) => {
    if (!name) return;
    setCommand(`✅ Added ${quantity} x ${name}`);
    setShoppingList(prevList => {
      const existingItem = prevList.find(item => item.name === name);
      if (existingItem) {
        return prevList.map(item => item.name === name ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        return [...prevList, { name, quantity, category: findCategory(name) }];
      }
    });
  };

  const handleRemoveItem = ({ name, quantity }) => {
     if (!name) return;
     setCommand(`❌ Removed ${quantity} x ${name}`);
     setShoppingList(prevList => {
        const itemIndex = prevList.findIndex(item => item.name === name);
        if (itemIndex === -1) return prevList;
        
        const currentItem = prevList[itemIndex];
        const newQuantity = currentItem.quantity - quantity;

        if (newQuantity <= 0) {
            return prevList.filter((_, index) => index !== itemIndex);
        } else {
            return prevList.map(item => item.name === name ? { ...item, quantity: newQuantity } : item);
        }
     });
  };

  const handleModifyItem = ({ name, quantity }) => {
    if (!name) return;
    setCommand(`🔄 Changed ${name} quantity to ${quantity}`);
    setShoppingList(prevList => {
        const itemExists = prevList.some(item => item.name === name);
        if(itemExists){
            return prevList.map(item => item.name === name ? {...item, quantity: quantity} : item);
        } else {
            return [...prevList, {name, quantity, category: findCategory(name)}];
        }
    })
  };
  
  const handleClearList = () => {
    if (shoppingList.length > 0) {
      localStorage.setItem("shoppingHistory", JSON.stringify(shoppingList));
    }
    setCommand("🗑️ List cleared.");
    setShoppingList([]);
  };

  const handleSearch = (query) => {
    setCommand(`🔍 Searching for "${query}"`);
    let tempQuery = query;

    const priceMatch = tempQuery.match(/under \$?(\d+)/);
    const priceLimit = priceMatch ? parseFloat(priceMatch[1]) : null;
    if(priceLimit) tempQuery = tempQuery.replace(/under \$?(\d+)/, "").trim();

    const sizeMatch = tempQuery.match(/(small|large|gallon|liter|bag|box|loaf)/);
    const sizeFilter = sizeMatch ? sizeMatch[0] : null;
    if(sizeFilter) tempQuery = tempQuery.replace(sizeFilter, "").trim();

    const results = mockProducts.filter(product => {
        const nameMatch = product.name.includes(tempQuery) || product.brand.toLowerCase().includes(tempQuery);
        const priceCondition = priceLimit ? product.price < priceLimit : true;
        const sizeCondition = sizeFilter ? product.size.includes(sizeFilter) : true;
        return nameMatch && priceCondition && sizeCondition;
    });
    setSearchResults(results);
  };
  
  const generateSuggestions = () => {
    const seasonal = getSeasonalSuggestions().filter(item => !shoppingList.some(i => i.name.includes(item)));
    let substitute = null;
    if (shoppingList.length > 0) {
        const lastItemName = shoppingList[shoppingList.length - 1].name;
        const lastItemRoot = Object.keys(substituteMap).find(key => lastItemName.includes(key));
        if (lastItemRoot) {
            substitute = { for: lastItemRoot, options: substituteMap[lastItemRoot] };
        }
    }
    const history = JSON.parse(localStorage.getItem("shoppingHistory") || "[]");
    const historySuggestion = history.find(item => !shoppingList.some(i => i.name === item.name));
    setSuggestions({ seasonal, history: historySuggestion ? [historySuggestion] : [], substitute });
  };
  
  const startListening = () => SpeechRecognition.startListening({ continuous: true, language });
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setLoading(false);
  };
  const clearAll = () => {
    handleClearList();
    setSearchResults([]);
    setError("");
    setCommand("🗑️ List cleared and all data reset.");
  };

  return {
    shoppingList, suggestions, searchResults, listening, loading, error, command, transcript, browserSupportsSpeechRecognition,
    startListening, stopListening, clearAll,
  };
}