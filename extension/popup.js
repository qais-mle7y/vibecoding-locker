document.addEventListener('DOMContentLoaded', async () => {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const lockerPanel = document.getElementById('locker-panel');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  
  const urlInput = document.getElementById('sb-url');
  const anonKeyInput = document.getElementById('sb-anon-key');
  const jwtInput = document.getElementById('sb-jwt');
  
  const searchInput = document.getElementById('search-input');
  const itemList = document.getElementById('item-list');
  const loading = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const toast = document.getElementById('toast');

  let allItems = [];

  // Load settings
  chrome.storage.local.get(['sbUrl', 'sbAnonKey', 'sbJwt'], (result) => {
    if (result.sbUrl && result.sbAnonKey && result.sbJwt) {
      urlInput.value = result.sbUrl;
      anonKeyInput.value = result.sbAnonKey;
      jwtInput.value = result.sbJwt;
      fetchItems();
    } else {
      toggleSettings(true);
    }
  });

  settingsBtn.addEventListener('click', () => {
    const isHidden = settingsPanel.classList.contains('hidden');
    toggleSettings(isHidden);
  });

  saveSettingsBtn.addEventListener('click', () => {
    const sbUrl = urlInput.value.trim();
    const sbAnonKey = anonKeyInput.value.trim();
    const sbJwt = jwtInput.value.trim();

    if (!sbUrl || !sbAnonKey || !sbJwt) {
      showError('Please fill out all settings fields.');
      return;
    }

    chrome.storage.local.set({ sbUrl, sbAnonKey, sbJwt }, () => {
      toggleSettings(false);
      fetchItems();
    });
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allItems.filter(item => 
      item.title.toLowerCase().includes(query) || 
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.language && item.language.toLowerCase().includes(query))
    );
    renderItems(filtered);
  });

  function toggleSettings(show) {
    if (show) {
      settingsPanel.classList.remove('hidden');
      lockerPanel.classList.add('hidden');
    } else {
      settingsPanel.classList.add('hidden');
      lockerPanel.classList.remove('hidden');
    }
  }

  async function fetchItems() {
    loading.classList.remove('hidden');
    errorEl.classList.add('hidden');
    itemList.innerHTML = '';
    allItems = [];

    chrome.storage.local.get(['sbUrl', 'sbAnonKey', 'sbJwt'], async (result) => {
      try {
        const res = await fetch(`${result.sbUrl}/rest/v1/locker_items?select=id,title,item_type,language,content&order=created_at.desc`, {
          headers: {
            'apikey': result.sbAnonKey,
            'Authorization': `Bearer ${result.sbJwt}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch. Check your JWT token or URL.');
        }

        const data = await res.json();
        allItems = data;
        renderItems(data);
      } catch (err) {
        showError(err.message);
      } finally {
        loading.classList.add('hidden');
      }
    });
  }

  function renderItems(items) {
    itemList.innerHTML = '';
    if (items.length === 0) {
      itemList.innerHTML = '<li class="item" style="cursor:default; text-align:center; color:var(--text-muted)">No items found.</li>';
      return;
    }

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'item';
      
      const title = document.createElement('div');
      title.className = 'item-title';
      title.textContent = item.title;

      const meta = document.createElement('div');
      meta.className = 'item-meta';
      
      const typeBadge = document.createElement('span');
      typeBadge.className = 'badge';
      typeBadge.textContent = item.item_type.replace('_', ' ');

      meta.appendChild(typeBadge);

      if (item.language) {
        const langBadge = document.createElement('span');
        langBadge.className = 'badge';
        langBadge.style.background = 'transparent';
        langBadge.style.border = '1px solid var(--border-color)';
        langBadge.textContent = item.language;
        meta.appendChild(langBadge);
      }

      li.appendChild(title);
      li.appendChild(meta);

      li.addEventListener('click', () => {
        navigator.clipboard.writeText(item.content).then(() => {
          showToast();
          // Optionally increment copy count via REST API here, skipping for MVP speed
        });
      });

      itemList.appendChild(li);
    });
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }

  function showToast() {
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2000);
  }
});
