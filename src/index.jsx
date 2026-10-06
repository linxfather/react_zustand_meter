import React from 'react';
import { createRoot } from 'react-dom/client';
import { PageMeter } from './pages/PageMeter';
import { PageChess1 } from './pages/PageChess1';
import { PageChess2 } from './pages/PageChess2';

//#region Router
const {pathname} = document.location;
let RootPage;
if (pathname === '/meter') {
  RootPage = PageMeter;
} else if (pathname === '/eventemitter3') {
  RootPage = PageChess1;
} else if (pathname === '/zustand') {
  RootPage = PageChess2;
} else {
  RootPage = function() { return (
    <div>Welcome:<br />
    <a href="/meter" className="text-blue-500"><u>/meter</u></a><br />
    <a href="/eventemitter3" className="text-blue-500"><u>/eventemitter3</u></a><br />
    <a href="/zustand" className="text-blue-500"><u>/zustand</u></a><br />
    </div>) };
}
//#endregion

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <RootPage />
);
