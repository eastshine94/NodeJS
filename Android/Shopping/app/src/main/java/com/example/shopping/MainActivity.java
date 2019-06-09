package com.example.shopping;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button button = (Button) findViewById(R.id.button);
        button.setOnClickListener(new View.OnClickListener(){
            @Override
            public  void onClick(View v){
                request();
            }
        });
    }

    public void request(){
        EditText editText = (EditText) findViewById(R.id.editText);
        String url = editText.getText().toString();
        StringRequest request = new StringRequest(
                Request.Method.POST,
                url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        println(response);
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        println("에러 발생함.");
                    }
                });

        request.setShouldCache(false);
        Volley.newRequestQueue(this).add(request);
        println("요청함." + url);

    }

    public void println(String data){
        Toast.makeText(this,data,Toast.LENGTH_LONG).show();
    }
}
