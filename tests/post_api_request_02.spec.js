import { test, expect } from "@playwright/test";
import postRequest from "../test-data/post_request_body.json";

test("Create POST api request using JSON file in playwright", async ({
  request,
}) => {
  // create post api request using playwright
  const postAPIResponse = await request.post("/booking", {
    data: postRequest,
  });

  // validate status code
  console.log(await postAPIResponse.json());

  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  // validate api response json obj
  const postAPIResponseBody = await postAPIResponse.json();

  expect(postAPIResponseBody.booking).toHaveProperty(
    "firstname",
    "testers talk playwright"
  );
  expect(postAPIResponseBody.booking).toHaveProperty(
    "lastname",
    "testers talk api testing"
  );

  // validate api response nested json obj
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkin",
    "2018-01-01"
  );
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkout_renamed_again",
    "2019-01-01"
  );
});
