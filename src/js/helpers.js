export async function reqJSON(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(10)]);
    console.log(res);
    const data = await res.json();
    console.log(data);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
    
  } catch (err) {
    throw err;
  }
}


export const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};
