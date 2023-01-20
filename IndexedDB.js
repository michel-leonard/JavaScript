	document.body.innerHTML = ""

	document.addEventListener("DOMContentLoaded", async () => {
		// INIT
		const init = new Promise((res, err) => {
			const link = window.indexedDB.open("YOUR_DB_NAME")
			link.onupgradeneeded = e => {
				const s = link.result.createObjectStore('YOUR_STORE', {autoIncrement: true})
				s.createIndex('YOUR_INDEX', ["COL_1", "COL_2"], {unique:false})
			}
			link.onsuccess = () => res(link.result)
		})
		
		const link = await init
		
		// SET
		{
			const s = link.transaction("YOUR_STORE", "readwrite", {durability : "relaxed"}).objectStore("YOUR_STORE")
			const r = s.put({ COL_1 : "data_1", COL_2 : "data_2", COL_3 : Math.random() })
			await new Promise(res => r.onsuccess = r.onerror = res)
		}
		
		// GET
		{
			const s = link.transaction("YOUR_STORE", "readonly").objectStore("YOUR_STORE")
			const i = s.index("YOUR_INDEX")
			const c = i.openCursor(IDBKeyRange.only(["data_1", "data_2"]))
			c.onsuccess = () => {
				const iter = c.result
				const row = iter?.value
				if (row)
					document.body.innerHTML += "<br>" + JSON.stringify(row)
				else
					document.body.innerHTML += "<br>done"
				iter.continue()
			}
		}
	})
