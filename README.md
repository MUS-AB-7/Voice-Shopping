How It Works Application works:
This project is a voice-controlled shopping list built with React. All the main logic and "brainpower" is packed into a single custom hook called useShoppingAssistant.

Here’s a simple breakdown of the process:

1. Voice Recognition
The app uses the react-speech-recognition library to listen to your voice and convert it into text. When you press the microphone button, it captures everything you say.

2. Understanding Your Commands
Once you stop talking, the app analyzes the transcribed text to figure out what you want to do.

It looks for command words like add, remove, change, or find.

It then pulls out the item name (e.g., "apples") and the quantity. It's smart enough to understand both digits (5) and words (five).

For example, in the phrase "add two bananas," it identifies:

Command: add

Quantity: 2

Item: bananas

3. Updating the Shopping List
Based on the command it understood, the app updates the list:

Adding: If you add an item that's already on the list, it just increases the quantity. If it's a new item, it adds it to the list.

Removing/Changing: It finds the item on the list and either removes it, reduces its quantity, or changes it to a new quantity.

Searching: If you ask it to find something, it filters a built-in list of products and shows you the results.

4. Smart Suggestions & Persistence
Suggestions: The app provides helpful suggestions for seasonal produce, substitutes for items you add (like suggesting "oat milk" for "milk"), and reminds you of items you've bought in the past.

Saving Your List: Your shopping list is automatically saved in your browser's localStorage. This means you can close the tab or your browser, and your list will still be there when you come back!
