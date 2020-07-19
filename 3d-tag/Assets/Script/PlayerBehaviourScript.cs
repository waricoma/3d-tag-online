using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerBehaviourScript : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        ScreenCapture.CaptureScreenshot("Assets/images/screenshot.png");
    }

    void FixedUpdate ()
	{
        float speed = 5;
        float x =  Input.GetAxis("Horizontal");
		float z = Input.GetAxis("Vertical");
        bool isEnabledSpace = Input.GetKey(KeyCode.Space);
        bool isEnabledShift = Input.GetKey(KeyCode.LeftShift);

        Rigidbody rigidbody = GetComponent<Rigidbody>();

        if(isEnabledShift) {
            speed = 10;
        }

        if (x < 0) {
            rigidbody.AddForce(speed , 0, 0);
        } else if (x > 0) {
            rigidbody.AddForce(-speed, 0, 0);
        }

        if (z < 0) {
            rigidbody.AddForce(0, 0, speed);
        } else if (z > 0) {
            rigidbody.AddForce(0, 0, -speed);
        }

        if (isEnabledSpace) {
            rigidbody.AddForce(0, speed * 5 , 0);
        }
	}
}
