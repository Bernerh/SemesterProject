export async function createCard(form) {
  const token = localStorage.getItem('token');

  const cardForm = new URLSearchParams(new FormData(form));

  console.log(cardForm);

  try {
    const response = await fetch("/cards/create", {
      method: 'POST',
      headers: {
        authorization: token,
      },
      body: cardForm
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log('Card created:', responseData);
    } else {
      throw new Error(responseData.message);
    }
  } catch (error) {
    console.error('Error creating card:', error);
  }

}

export async function getCards() {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch("/cards/all", {
      method: 'GET',
      headers: {
        authorization: token,
      },
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log(responseData);
      localStorage.setItem("cards", JSON.stringify(responseData));
      renderCardSets(responseData);
    } else {
      throw new Error(responseData.message);
    }
  } catch (error) {
    console.error('Error creating card:', error);
  }
}

export async function getCardInfo(id){
  const token = localStorage.getItem('token');

  try {
    const response = await fetch("/cards/" + id, {
      method: 'GET',
      headers: {
        authorization: token,
      },
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log(responseData);
      return responseData;
    } else {
      throw new Error(responseData.message);
    }
  } catch (error) {
    console.error('Error creating card:', error);
  }
}

export async function deleteCards(id){
  const token = localStorage.getItem('token');

  console.log(id);

  try {
    const response = await fetch("/cards/" + id, {
      method: 'DELETE',
      headers: {
        authorization: token,
      },
    });

    const responseData = await response.json();
    if (response.ok) {
      console.log(responseData);
      return responseData;
    } else {
      throw new Error(responseData.message);
    }
  } catch (error) {
    console.error('Error deleting card:', error);
  }

}