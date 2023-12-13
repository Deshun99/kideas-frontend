export const getUserByUserId = async (userId, role, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/search?userId=${userId}&role=${role}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );
    const responseBody = await res.json();

    if (responseBody.statusCode === 404) {
      throw new Error(responseBody.message || "An error occurred");
    }
    return await responseBody;
  } catch (error) {
    console.log("There was a problem fetching the users", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const responseBody = await res.json();

    // if (responseBody.statusCode === 409) {
    //   throw new Error(responseBody.message || "An error occurred");
    // }
    console.log(responseBody);
    return await responseBody;
  } catch (error) {
    console.log("There was a problem fetching the users", error);
    throw error;
  }
}
