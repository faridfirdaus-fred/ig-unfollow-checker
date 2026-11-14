// ==UserScript==
// @name         Instagram Unfollow Checker
// @namespace    https://github.com/faridfirdaus-fred/ig-unfollow-checker
// @version      1.0.0
// @description  Cek siapa following Instagram yang tidak follow back langsung di browser dengan UI modern dan aman.
// @author       Farid Firdaus
// @match        https://*.instagram.com/*
// @icon         https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png
// @grant        GM_setClipboard
// @grant        GM_download
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/faridfirdaus-fred/ig-unfollow-checker/main/ig-unfollow-checker.user.js
// @downloadURL  https://raw.githubusercontent.com/faridfirdaus-fred/ig-unfollow-checker/main/ig-unfollow-checker.user.js
// ==/UserScript==

(function () {
  'use strict';

  // Tambahkan floating trigger button di pojok kanan bawah
  function initTriggerButton() {
    if (document.getElementById('ig-checker-trigger-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'ig-checker-trigger-btn';
    btn.innerHTML = '🔍 Check Follback';
    btn.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999998;
      background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      color: #fff;
      border: none;
      border-radius: 30px;
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      transition: transform 0.2s, box-shadow 0.2s;
    `;

    btn.onmouseover = () => { btn.style.transform = 'scale(1.05)'; };
    btn.onmouseout = () => { btn.style.transform = 'scale(1)'; };
    btn.onclick = () => { runScanner(); };

    document.body.appendChild(btn);
  }

  function runScanner() {
    const EXISTING_MODAL = document.getElementById('ig-unfollow-modal');
    if (EXISTING_MODAL) {
      EXISTING_MODAL.remove();
    }

    const getCookie = (name) => {
      const value = '; ' + document.cookie;
      const parts = value.split('; ' + name + '=');
      if (parts.length === 2) return parts.pop().split(';').shift();
      return '';
    };

    let userId = getCookie('ds_user_id');
    const csrfToken = getCookie('csrftoken');

    if (!userId) {
      alert('[IG Checker] Cookie sesi (ds_user_id) tidak ditemukan. Pastikan Anda sudah login di instagram.com!');
      return;
    }

    // --- STYLING & FLOATING UI ---
    const container = document.createElement('div');
    container.id = 'ig-unfollow-modal';
    container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 480px;
      max-width: 90vw;
      max-height: 85vh;
      background: #121212;
      color: #e0e0e0;
      border: 1px solid #2d2d2d;
      border-radius: 14px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.7);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;

    container.innerHTML = `
      <div style="padding: 16px 20px; background: #1a1a1a; border-bottom: 1px solid #2d2d2d; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 700; font-size: 15px; color: #fff;">IG Unfollow Checker</span>
          <span style="font-size: 11px; background: #2979ff; color: #fff; padding: 2px 7px; border-radius: 10px; font-weight: 600;">Userscript</span>
        </div>
        <button id="ig-btn-close" style="background: none; border: none; color: #888; font-size: 20px; cursor: pointer; line-height: 1;">&times;</button>
      </div>

      <div id="ig-body" style="padding: 20px; overflow-y: auto; flex: 1;">
        <div id="ig-status-box" style="margin-bottom: 16px;">
          <div id="ig-status-text" style="font-size: 13px; color: #aaa; margin-bottom: 8px;">Menyiapkan scanner...</div>
          <div style="height: 6px; width: 100%; background: #222; border-radius: 3px; overflow: hidden;">
            <div id="ig-progress-bar" style="height: 100%; width: 5%; background: #0095f6; transition: width 0.3s ease;"></div>
          </div>
        </div>

        <div id="ig-stats" style="display: none; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
          <div style="background: #1e1e1e; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #2a2a2a;">
            <div style="font-size: 11px; color: #888; text-transform: uppercase;">Following</div>
            <div id="ig-stat-following" style="font-size: 18px; font-weight: 700; color: #fff; margin-top: 4px;">0</div>
          </div>
          <div style="background: #1e1e1e; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #2a2a2a;">
            <div style="font-size: 11px; color: #888; text-transform: uppercase;">Followers</div>
            <div id="ig-stat-followers" style="font-size: 18px; font-weight: 700; color: #fff; margin-top: 4px;">0</div>
          </div>
          <div style="background: #2c1a1a; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #5a2a2a;">
            <div style="font-size: 11px; color: #ff8a80; text-transform: uppercase;">Gak Follback</div>
            <div id="ig-stat-diff" style="font-size: 18px; font-weight: 700; color: #ff5252; margin-top: 4px;">0</div>
          </div>
        </div>

        <div id="ig-results-container" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <input type="text" id="ig-search" placeholder="Cari username..." style="width: 100%; background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 8px 12px; color: #fff; font-size: 12px; outline: none;">
          </div>
          <div id="ig-user-list" style="max-height: 220px; overflow-y: auto; background: #161616; border-radius: 8px; border: 1px solid #262626; padding: 4px 0;"></div>
        </div>
      </div>

      <div id="ig-footer" style="padding: 14px 20px; background: #1a1a1a; border-top: 1px solid #2d2d2d; display: flex; gap: 10px; justify-content: flex-end;">
        <button id="ig-btn-copy" disabled style="padding: 8px 14px; background: #262626; color: #777; border: 1px solid #333; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: not-allowed; transition: all 0.2s;">Salin Semua Link</button>
        <button id="ig-btn-download" disabled style="padding: 8px 14px; background: #0095f6; color: #fff; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: not-allowed; opacity: 0.5; transition: all 0.2s;">Unduh TXT</button>
      </div>
    `;

    document.body.appendChild(container);

    const statusText = document.getElementById('ig-status-text');
    const progressBar = document.getElementById('ig-progress-bar');
    const statFollowing = document.getElementById('ig-stat-following');
    const statFollowers = document.getElementById('ig-stat-followers');
    const statDiff = document.getElementById('ig-stat-diff');
    const statsBox = document.getElementById('ig-stats');
    const resultsContainer = document.getElementById('ig-results-container');
    const userList = document.getElementById('ig-user-list');
    const searchInput = document.getElementById('ig-search');
    const btnCopy = document.getElementById('ig-btn-copy');
    const btnDownload = document.getElementById('ig-btn-download');
    const btnClose = document.getElementById('ig-btn-close');

    btnClose.onclick = () => container.remove();

    const headers = {
      'X-IG-App-ID': '936619743392459',
      'X-CSRFToken': csrfToken
    };

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    async function fetchUsers(type) {
      let users = new Map();
      let maxId = '';
      let page = 1;

      while (true) {
        statusText.innerText = `Mengambil ${type}... (halaman ${page}, terkumpul: ${users.size})`;
        let url = `https://www.instagram.com/api/v1/friendships/${userId}/${type}/?count=50`;
        if (maxId) url += `&max_id=${encodeURIComponent(maxId)}`;

        let res;
        try {
          res = await fetch(url, { headers, credentials: 'include' });
        } catch (err) {
          console.error(`[IG Checker] Network error saat fetch ${type}:`, err);
          break;
        }

        if (!res.ok) {
          console.warn(`[IG Checker] Status ${res.status} saat fetch ${type}`);
          break;
        }

        const data = await res.json();
        if (!data.users || data.users.length === 0) break;

        for (const u of data.users) {
          users.set(u.username, u.full_name || u.username);
        }

        if (!data.next_max_id) break;
        maxId = data.next_max_id;
        page++;
        await sleep(1000);
      }
      return users;
    }

    (async () => {
      try {
        progressBar.style.width = '20%';
        const followersMap = await fetchUsers('followers');
        progressBar.style.width = '60%';

        const followingMap = await fetchUsers('following');
        progressBar.style.width = '90%';

        statusText.innerText = 'Membandingkan data followers vs following...';

        const notFollback = [];
        for (const [username, fullName] of followingMap.entries()) {
          if (!followersMap.has(username)) {
            notFollback.push({ username, fullName, url: `https://www.instagram.com/${username}/` });
          }
        }

        progressBar.style.width = '100%';
        statusText.innerText = `Selesai! Ditemukan ${notFollback.length} akun yang tidak follback.`;

        statFollowing.innerText = followingMap.size;
        statFollowers.innerText = followersMap.size;
        statDiff.innerText = notFollback.length;
        statsBox.style.display = 'grid';
        resultsContainer.style.display = 'block';

        function renderList(items) {
          userList.innerHTML = '';
          if (items.length === 0) {
            userList.innerHTML = '<div style="padding: 16px; text-align: center; color: #777; font-size: 13px;">Tidak ada akun ditemukan.</div>';
            return;
          }

          items.forEach((item, index) => {
            const row = document.createElement('div');
            row.style.cssText = `
              padding: 8px 14px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #222;
              font-size: 13px;
            `;
            row.innerHTML = `
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 300px;">
                <span style="color: #666; font-size: 11px; margin-right: 6px;">#${index + 1}</span>
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="color: #0095f6; text-decoration: none; font-weight: 600;">@${item.username}</a>
                <span style="color: #888; font-size: 11px; margin-left: 6px;">(${item.fullName})</span>
              </div>
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="color: #888; font-size: 11px; text-decoration: none; border: 1px solid #333; padding: 3px 8px; border-radius: 4px;">Kunjungi &rarr;</a>
            `;
            userList.appendChild(row);
          });
        }

        renderList(notFollback);

        searchInput.oninput = (e) => {
          const query = e.target.value.toLowerCase().trim();
          const filtered = notFollback.filter(u => 
            u.username.toLowerCase().includes(query) || 
            u.fullName.toLowerCase().includes(query)
          );
          renderList(filtered);
        };

        const allUrls = notFollback.map(u => u.url);

        if (notFollback.length > 0) {
          btnCopy.disabled = false;
          btnCopy.style.cursor = 'pointer';
          btnCopy.style.color = '#fff';
          btnCopy.onclick = () => {
            navigator.clipboard.writeText(allUrls.join('\n')).then(() => {
              const originalText = btnCopy.innerText;
              btnCopy.innerText = '✓ Berhasil Disalin!';
              setTimeout(() => { btnCopy.innerText = originalText; }, 2000);
            });
          };

          btnDownload.disabled = false;
          btnDownload.style.cursor = 'pointer';
          btnDownload.style.opacity = '1';
          btnDownload.onclick = () => {
            const content = `=== DAFTAR TIDAK FOLLBACK (${notFollback.length} AKUN) ===\nTanggal: ${new Date().toLocaleString()}\nTotal Following: ${followingMap.size}\nTotal Followers: ${followersMap.size}\n\n` + allUrls.join('\n');
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `tidak_follback_${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        }

        console.log(`[IG Checker] Berhasil! ${notFollback.length} akun tidak follback:`);
        allUrls.forEach(url => console.log(url));

      } catch (err) {
        console.error('[IG Checker] Fatal error:', err);
        statusText.innerText = 'Terjadi kesalahan saat pemindaian. Cek konsol DevTools.';
        statusText.style.color = '#ff5252';
      }
    })();
  }

  // Jalankan inisialisasi tombol trigger
  window.addEventListener('load', initTriggerButton);
  setTimeout(initTriggerButton, 2000);
})();
