import { test, expect } from "@playwright/test";

test.describe.serial('API tests', () => {
  let b_id;
  let tokenNo;

  test('Creating a Booking using POST api request', async ({ request }) => {
    // create post api request using playwright
    const postAPIResponse = await request.post("/booking", {
      data: {
        firstname: "API",
        lastname: "Testing",
        totalprice: 1000,
        depositpaid: true,
        bookingdates: {
          checkin: "2024-12-31",
          checkout: "2025-01-02",
        },
        additionalneeds: "Playwright",
      },
    });

    // validate status code
    console.log(await postAPIResponse.json());

    expect(postAPIResponse.ok()).toBeTruthy();
    expect(postAPIResponse.status()).toBe(200);

    // validate api response json obj
    const postAPIResponseBody = await postAPIResponse.json();
    b_id = postAPIResponseBody.bookingid;

    expect(postAPIResponseBody.booking).toHaveProperty(
      "firstname",
      "API"
    );
    expect(postAPIResponseBody.booking).toHaveProperty(
      "lastname",
      "Testing"
    );

    // validate api response nested json obj
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
      "checkin",
      "2024-12-31"
    );
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
      "checkout",
      "2025-01-02"
    );
  });

  test('Get the booking details using GET api request', async ({ request }) => {
    // Ensure b_id is set before running this test
    if (!b_id) {
      throw new Error('Booking ID (b_id) is not set');
    }

    // create GET api request using playwright
    const getAPIResponse = await request.get(`/booking/${b_id}`, {});

    // validate status code
    console.log(await getAPIResponse.json());
    expect(getAPIResponse.ok()).toBeTruthy();
    expect(getAPIResponse.status()).toBe(200);
  });

  test("Generate auth token & update booking details using PUT api request", async ({ request }) => {

    // generate token
    const tokenAPIResponse = await request.post("/auth", {
      data: {
        "username": "admin",
        "password": "password123"
      },
    });
    expect(tokenAPIResponse.ok()).toBeTruthy();
    expect(tokenAPIResponse.status()).toBe(200);

    console.log(await tokenAPIResponse.json());
    const tokenResponseBody = await tokenAPIResponse.json();
    tokenNo = tokenResponseBody.token;

    // update booking details
    const putAPIResponse = await request.put(`/booking/${b_id}`, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": `token=${tokenNo}`,
      },
      data: {
        "firstname": "Playwright",
        "lastname": "Automation",
        "totalprice": 1000,
        "depositpaid": true,
        "bookingdates": {
          "checkin": "2024-12-30",
          "checkout": "2025-01-01"
        },
        "additionalneeds": "orange"
      },
    });

    console.log(await putAPIResponse.json());
    expect(putAPIResponse.ok()).toBeTruthy();
    expect(putAPIResponse.status()).toBe(200);
  });

  test("Partially updating the booking details using PATCH api request", async ({ request }) => {

    // partial update booking details
    const patchAPIResponse = await request.patch(`/booking/${b_id}`, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": `token=${tokenNo}`
      },
      data: {
        firstname: "Test",
        lastname: "Unity"
      },
    });

    console.log(await patchAPIResponse.json());
    expect(patchAPIResponse.ok()).toBeTruthy();
    expect(patchAPIResponse.status()).toBe(200);
  });

  test("Deleting the Booking using DELETE api request.", async ({ request }) => {

    // DELETE api request
    const deleteAPIResponse = await request.delete(`/booking/${b_id}`, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": `token=${tokenNo}`,
      },
    });

    expect(deleteAPIResponse.status()).toBe(201);
    expect(deleteAPIResponse.statusText()).toBe("Created");
  });


});
