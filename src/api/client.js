import axios from "axios";

const URL = "https://opentdb.com";

async function getCategories() {
  try {
    const res = await axios.get(`${URL}/api_category.php`);
    return res.data.trivia_categories;
  } catch (e) {
    console.log(e);
  }
}

async function getQuestions(numOfQs, catId) {
  console.log(numOfQs, catId);
  try {
    const res = await axios.get(
      `${URL}/api.php?amount=${numOfQs}&category=${catId}&type=multiple`
    );
    console.log(res);
    return res.data.results;
  } catch (e) {
    console.log(e);
  }
}

export { getCategories, getQuestions };
