function fetchData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
  
        const data = { message: 'Hello, World!' };
        resolve(data);
      }, 1000); 
    });
  }

async function getData() {
    try {
      const response = await fetchData(); 
      const result = response.message;
      console.log(" result is ",response); 
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }


  
  console.log("getData is ",getData());