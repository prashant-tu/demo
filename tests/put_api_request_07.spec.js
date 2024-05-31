import { test, expect } from "@playwright/test";
import postRequest from "../test-data/post_request_body.json";
import tokenRequest from "../test-data/token_request_body.json";
import putRequest from "../test-data/put_request_body.json";
import { json } from "stream/consumers";

test("Query parameter in playwright api testing", async ({ request }) => {
  // create post api request using playwright
  const postAPIResponse = await request.post("/booking", {
    data: postRequest,
  });

  const bookingId = await postAPIResponse.json();
  const bId = bookingId.bookingid;

  // create GET api request using playwright
  const getAPIResponse = await request.get("/booking/", {
    params: {
      firstname: "testers talk playwright",
      lastname: "testers talk api testing",
    },
  });

  // validate status code
  console.log(await getAPIResponse.json());
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);

  // generate token
  const tokenAPIResponse = await request.post("/auth", {
    data: tokenRequest,
  });
  expect(tokenAPIResponse.ok()).toBeTruthy();
  expect(tokenAPIResponse.status()).toBe(200);

  console.log(await tokenAPIResponse.json());
  const tokenResponseBody = await tokenAPIResponse.json();
  const tokenNo = tokenResponseBody.token;

  // update booking details
  const putAPIResponse = await request.put(`/booking/${bId}`, {
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${tokenNo}`,
    },
    data: putRequest,
  });

  console.log(await putAPIResponse.json());
  expect(putAPIResponse.ok()).toBeTruthy();
  expect(putAPIResponse.status()).toBe(200);
});
