import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, RefreshCw } from "lucide-react";

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  "🍒": 2,
  "🍋": 4,
  "🍊": 6,
  "🍇": 8,
};

const SYMBOL_VALUES = {
  "🍒": 5,
  "🍋": 4,
  "🍊": 3,
  "🍇": 2,
};

export default function SlotMachine() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [lines, setLines] = useState(3);
  const [reels, setReels] = useState([[]]);
  const [winnings, setWinnings] = useState(0);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    spin();
  }, []);

  const spin = () => {
    setSpinning(true);
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
      for (let i = 0; i < count; i++) {
        symbols.push(symbol);
      }
    }

    const newReels = [];
    for (let i = 0; i < COLS; i++) {
      newReels.push([]);
      const reelSymbols = [...symbols];
      for (let j = 0; j < ROWS; j++) {
        const randomIndex = Math.floor(Math.random() * reelSymbols.length);
        const selectedSymbol = reelSymbols[randomIndex];
        newReels[i].push(selectedSymbol);
        reelSymbols.splice(randomIndex, 1);
      }
    }

    setTimeout(() => {
      setReels(newReels);
      const rows = transpose(newReels);
      const newWinnings = getWinnings(rows, bet, lines);
      setWinnings(newWinnings);
      setBalance((prevBalance) => prevBalance - bet * lines + newWinnings);
      setSpinning(false);
    }, 1000);
  };

  const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
      rows.push([]);
      for (let j = 0; j < COLS; j++) {
        rows[i].push(reels[j][i]);
      }
    }
    return rows;
  };

  const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
      const symbols = rows[row];
      let allSame = true;
      for (const symbol of symbols) {
        if (symbol !== symbols[0]) {
          allSame = false;
          break;
        }
      }
      if (allSame) {
        winnings += bet * SYMBOL_VALUES[symbols[0]];
      }
    }
    return winnings;
  };

  const handleSpin = () => {
    if (balance >= bet * lines) {
      spin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-6 text-purple-600">
          Fruit Spinner
        </h1>
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <Coins className="text-yellow-500 mr-2" />
            <span className="text-2xl font-semibold">${balance}</span>
          </div>
          <div className="flex space-x-4">
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Math.max(1, parseInt(e.target.value)))}
              className="w-20 px-2 py-1 border rounded"
            />
            <select
              value={lines}
              onChange={(e) => setLines(parseInt(e.target.value))}
              className="px-2 py-1 border rounded"
            >
              <option value={1}>1 Line</option>
              <option value={2}>2 Lines</option>
              <option value={3}>3 Lines</option>
            </select>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-3 gap-4">
            {reels.map((reel, i) => (
              <div key={i} className="bg-white rounded-md overflow-hidden">
                {reel.map((symbol, j) => (
                  <motion.div
                    key={j}
                    className="text-6xl flex items-center justify-center h-24"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 + j * 0.1 }}
                  >
                    {symbol}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold">Winnings: ${winnings}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold text-lg flex items-center"
            onClick={handleSpin}
            disabled={spinning || balance < bet * lines}
          >
            {spinning ? (
              <RefreshCw className="animate-spin mr-2" />
            ) : (
              <Coins className="mr-2" />
            )}
            Spin
          </motion.button>
        </div>
      </div>
    </div>
  );
}
