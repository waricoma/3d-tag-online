using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using System;
using System.Text;

public class EnemyBehaviourScript : MonoBehaviour
{
    public UnityEngine.UI.Text catchedCountLabel;

    private int catchedCount = 0;

    // Start is called before the first frame update
    void Start()
    {
        catchedCountLabel.text = catchedCount.ToString();
    }

    // Update is called once per frame
    void Update()
    {

    }

    void FixedUpdate()
    {
        FileInfo fi = new FileInfo(Application.dataPath + "/" + "enemy-status.csv");

        using (StreamReader sr = new StreamReader(fi.OpenRead(), Encoding.UTF8)){
            string enemyCsvTxt = sr.ReadToEnd();
            string[] enemyCsvArr = enemyCsvTxt.Split(',');

            if (enemyCsvArr.Length != 6) {
               return;
            }

            float speed = 5;
            float x = 0;
		    float z = 0;

            if (enemyCsvArr[0].Equals("0") && enemyCsvArr[1].Equals("1")) { // ↓
                z = -1;
            } else if (enemyCsvArr[0].Equals("1") && enemyCsvArr[1].Equals("0")) { // ↑
                z = 1;
            }

            if (enemyCsvArr[2].Equals("0") && enemyCsvArr[3].Equals("1")) { // →
                x = 1;
            } else if (enemyCsvArr[2].Equals("1") && enemyCsvArr[3].Equals("0")) { // ←
                x = -1;
            }

            bool isEnabledSpace = enemyCsvArr[4].Equals("1");
            bool isEnabledShift = enemyCsvArr[5].Equals("1");

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
                rigidbody.AddForce(0, speed * 5, 0);
            }
        }
    }

    void OnCollisionEnter(Collision collision)
    {
        if(collision.gameObject.name.Equals("Player")) {
            ++catchedCount;
            catchedCountLabel.text = catchedCount.ToString();
        }
    }
}
